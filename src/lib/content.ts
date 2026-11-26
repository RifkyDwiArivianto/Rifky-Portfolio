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

/** `null` berarti Supabase tidak terjangkau (beda dengan "terjangkau tapi kosong"). */
async function fetchRows(fresh: boolean): Promise<Rows | null> {
  const env = supabaseEnv();
  if (!env) return null;
  try {
    const url = `${env.url}/rest/v1/site_content?select=key,value`;
    const res = await withTimeout(
      fetch(url, {
        headers: authHeaders(env),
        ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
      }),
      5000,
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { key: string; value: unknown }[];
    const map: Rows = new Map();
    for (const row of rows) if (isContentKey(row.key)) map.set(row.key, row.value);
    return map;
  } catch {
    return null;
  }
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

/** Dipakai halaman publik. `cache` menggabungkan pemanggilan dari layout dan halaman dalam satu render. */
export const getContent = cache(async (): Promise<SiteContent> => assemble(await fetchRows(false)));

export interface AdminContent {
  values: Record<ContentKey, unknown>;
  /** bagian mana yang sudah punya isi sendiri di database */
  customized: Record<ContentKey, boolean>;
  /** false = Supabase tidak terjangkau; editor tidak boleh menyimpan agar tidak menimpa data */
  connected: boolean;
}

export async function getAdminContent(): Promise<AdminContent> {
  const rows = await fetchRows(true);
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
