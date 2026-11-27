// Pembaca konten di sisi server. Sumber utama: tabel site_content di Supabase.
// Bila Supabase belum diatur, lambat, atau datanya rusak, situs memakai isi bawaan di src/data
// sehingga halaman publik tidak pernah rusak.

import { cache } from "react";
import { CONTENT_KEYS, DEFAULTS, isContentKey, sanitizeSection, type ContentKey } from "./content-schema";
import { authHeaders, supabaseEnv } from "./supabase";
import type { Certificate, Project, SiteInfo, SkillGroup, Stat, TimelineItem } from "../types";

export interface SiteContent {
  site: SiteInfo;
  stats: Stat[];
  timeline: TimelineItem[];
  skills: SkillGroup[];
  certificates: Certificate[];
  projects: Project[];
}

type Rows = Map<ContentKey, unknown>;

const withTimeout = <T>(promise: Promise<T>, ms: number) =>
  Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Hasil membaca database: belum diatur, berhasil, atau gagal (ter-pause, jaringan, tabel belum dibuat). */
type Fetched = { status: "unconfigured" } | { status: "ok"; rows: Rows } | { status: "error"; reason: string };

async function fetchRows(fresh: boolean): Promise<Fetched> {
  const env = supabaseEnv();
  if (!env) return { status: "unconfigured" };

  let reason = "tidak diketahui";
  // dua percobaan supaya gangguan sesaat tidak dianggap proyek mati
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await withTimeout(
        fetch(`${env.url}/rest/v1/site_content?select=key,value`, {
          headers: authHeaders(env),
          ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
        }),
        5000,
      );
      if (res.ok) {
        const rows = (await res.json()) as { key: string; value: unknown }[];
        const map: Rows = new Map();
        for (const row of rows) if (isContentKey(row.key)) map.set(row.key, row.value);
        return { status: "ok", rows: map };
      }
      reason = `Supabase membalas HTTP ${res.status}`;
    } catch (error) {
      reason = error instanceof Error && error.message === "timeout" ? "Supabase tidak menjawab dalam 5 detik" : "tidak bisa terhubung ke Supabase";
    }
    if (attempt === 0) await sleep(400);
  }
  return { status: "error", reason };
}

function resolve(key: ContentKey, rows: Rows | null): unknown {
  if (!rows || !rows.has(key)) return DEFAULTS[key];
  const result = sanitizeSection(key, rows.get(key), true);
  return result.errors.length === 0 ? result.value : DEFAULTS[key];
}

function assemble(rows: Rows | null): SiteContent {
  const content = Object.fromEntries(CONTENT_KEYS.map((key) => [key, resolve(key, rows)])) as unknown as SiteContent;
  // tombol "Lihat proyek" tidak boleh menunjuk proyek yang sudah dihapus
  const ids = new Set(content.projects.map((p) => p.id));
  content.timeline = content.timeline.map((item) =>
    item.projectId && !ids.has(item.projectId) ? { ...item, projectId: undefined } : item,
  );
  return content;
}

/**
 * Dipakai halaman publik. `cache` menggabungkan pemanggilan dari layout dan halaman dalam satu render.
 *
 * Pengaman "isi terakhir": bila Supabase SUDAH diatur tapi tidak terjangkau (ter-pause, mati, tabel hilang),
 * di produksi fungsi ini sengaja melempar error. Next.js lalu tetap menayangkan halaman terakhir yang berhasil
 * dibuat dan mencoba lagi pada kunjungan berikutnya, sehingga isi hasil editan di admin tidak tertimpa isi
 * bawaan. Saat build, error yang sama menggagalkan deploy dengan pesan jelas, dan situs lama tetap tayang.
 * Isi bawaan hanya dipakai bila Supabase memang belum diatur, atau saat pengembangan lokal.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const result = await fetchRows(false);
  if (result.status === "ok") return assemble(result.rows);
  if (result.status === "unconfigured" || process.env.NODE_ENV !== "production") return assemble(null);
  throw new Error(
    `Konten tidak bisa dibaca dari database (${result.reason}). Halaman terakhir dipertahankan. ` +
      "Cek proyek Supabase (mungkin ter-pause: tekan Resume project) dan pastikan supabase/schema.sql sudah dijalankan.",
  );
});

export interface AdminContent {
  values: Record<ContentKey, unknown>;
  /** bagian mana yang sudah punya isi sendiri di database */
  customized: Record<ContentKey, boolean>;
  /** false = Supabase tidak terjangkau; editor tidak boleh menyimpan agar tidak menimpa data */
  connected: boolean;
}

export async function getAdminContent(): Promise<AdminContent> {
  const fetched = await fetchRows(true);
  const rows = fetched.status === "ok" ? fetched.rows : null;
  const values = {} as Record<ContentKey, unknown>;
  const customized = {} as Record<ContentKey, boolean>;
  for (const key of CONTENT_KEYS) {
    values[key] = resolve(key, rows);
    customized[key] = !!rows && rows.has(key);
  }
  return { values, customized, connected: rows !== null };
}

export async function saveSection(key: ContentKey, value: unknown): Promise<void> {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase belum diatur");
  const res = await fetch(`${env.url}/rest/v1/site_content?on_conflict=key`, {
    method: "POST",
    headers: { ...authHeaders(env), "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{ key, value, updated_at: new Date().toISOString() }]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase menolak penyimpanan (${res.status})`);
}

export async function resetSection(key: ContentKey): Promise<void> {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase belum diatur");
  const res = await fetch(`${env.url}/rest/v1/site_content?key=eq.${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: { ...authHeaders(env), Prefer: "return=minimal" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase menolak penghapusan (${res.status})`);
}
