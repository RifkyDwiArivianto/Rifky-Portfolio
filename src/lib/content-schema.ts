// Skema konten yang bisa diubah lewat /admin.
// Satu sumber untuk tiga hal: bentuk formulir di editor, validasi saat menyimpan,
// dan pembersihan data dari database saat halaman dibuat.
// Pakai impor relatif (bukan "@/") supaya modul ini mudah diuji di luar Next.js.

import { certificates as defaultCertificates } from "../data/certificates";
import { projects as defaultProjects } from "../data/projects";
import { site as defaultSite } from "../data/site";
import { skillGroups as defaultSkillGroups } from "../data/skills";
import { stats as defaultStats } from "../data/stats";
import { timeline as defaultTimeline } from "../data/timeline";

export type ContentKey = "site" | "stats" | "timeline" | "skills" | "certificates" | "projects";

export type Field =
  | { type: "text"; key: string; label: string; required?: boolean; multiline?: boolean; hint?: string; max?: number }
  | { type: "url"; key: string; label: string; required?: boolean; hint?: string }
  | { type: "email"; key: string; label: string; required?: boolean }
  | { type: "number"; key: string; label: string; required?: boolean; min?: number; max?: number; hint?: string }
  | { type: "bool"; key: string; label: string }
  | {
      type: "select";
      key: string;
      label: string;
      required?: boolean;
      options: { value: string; label: string }[];
      /** pilihan diambil dari daftar proyek yang sedang diedit */
      optionsFrom?: "projects";
    }
  | { type: "lines"; key: string; label: string; hint?: string }
  | { type: "id"; key: string }
  | { type: "image"; key: string; label: string }
  | { type: "group"; key: string; label: string; fields: Field[] }
  | { type: "list"; key: string; label: string; itemLabel: string; titleKey: string; fields: Field[]; min?: number; max?: number };

export interface SectionSpec {
  key: ContentKey;
  title: string;
  hint: string;
  root: Extract<Field, { type: "group" | "list" }>;
}

export const SECTIONS: SectionSpec[] = [
  {
    key: "site",
    title: "Profil & kontak",
    hint: "Nama, peran, deskripsi di bagian atas, serta tautan dan teks kontak.",
    root: {
      type: "group",
      key: "",
      label: "Profil",
      fields: [
        { type: "text", key: "name", label: "Nama lengkap", required: true, max: 80, hint: "Kata pertama ditonjolkan di judul." },
        { type: "text", key: "shortName", label: "Singkatan (logo di navigasi)", required: true, max: 12 },
        { type: "text", key: "role", label: "Peran / jabatan", required: true, max: 120 },
        { type: "text", key: "description", label: "Deskripsi singkat", required: true, multiline: true, max: 600 },
        { type: "lines", key: "heroTools", label: "Tag di bagian atas", hint: "Satu tag per baris." },
        { type: "number", key: "year", label: "Tahun (footer & statistik)", required: true, min: 2000, max: 2100 },
        { type: "email", key: "email", label: "Email", required: true },
        { type: "url", key: "github", label: "Tautan GitHub", required: true },
        { type: "url", key: "linkedin", label: "Tautan LinkedIn", required: true },
        {
          type: "group",
          key: "whatsapp",
          label: "WhatsApp",
          fields: [
            { type: "url", key: "href", label: "Tautan WhatsApp", required: true, hint: "Contoh: https://wa.me/628123456789" },
            { type: "text", key: "label", label: "Teks nomor", required: true, max: 40 },
          ],
        },
        { type: "text", key: "contactNote", label: "Paragraf di bagian Kontak", required: true, multiline: true, max: 600 },
      ],
    },
  },
  {
    key: "stats",
    title: "Statistik",
    hint: "Angka ringkas di bawah bagian atas halaman.",
    root: {
      type: "list",
      key: "",
      label: "Statistik",
      itemLabel: "Statistik",
      titleKey: "label",
      max: 6,
      fields: [
        { type: "text", key: "value", label: "Angka / nilai", required: true, max: 20 },
        { type: "text", key: "label", label: "Keterangan", required: true, max: 80 },
      ],
    },
  },
  {
    key: "projects",
    title: "Proyek",
    hint: "Kartu proyek beserta galeri gambarnya.",
    root: {
      type: "list",
      key: "",
      label: "Proyek",
      itemLabel: "Proyek",
      titleKey: "title",
      max: 20,
      fields: [
        { type: "id", key: "id" },
        { type: "text", key: "title", label: "Judul proyek", required: true, max: 120 },
        { type: "text", key: "org", label: "Perusahaan / konteks", required: true, max: 160 },
        { type: "text", key: "description", label: "Deskripsi", required: true, multiline: true, max: 600 },
        { type: "lines", key: "roles", label: "Peran saya", hint: "Satu peran per baris." },
        { type: "lines", key: "tools", label: "Tools", hint: "Satu tool per baris." },
        {
          type: "select",
          key: "preview",
          label: "Gaya pratinjau",
          required: true,
          options: [
            { value: "wide", label: "Satu gambar lebar (tangkapan layar desktop)" },
            { value: "phones", label: "Layar ponsel berjajar" },
          ],
        },
        { type: "number", key: "previewImages", label: "Jumlah gambar di pratinjau", required: true, min: 1, max: 6, hint: "Diambil dari urutan awal galeri." },
        { type: "bool", key: "flip", label: "Gambar di sisi kanan (layar lebar)" },
        {
          type: "list",
          key: "gallery",
          label: "Galeri gambar",
          itemLabel: "Gambar",
          titleKey: "alt",
          min: 1,
          max: 12,
          fields: [
            { type: "image", key: "src", label: "Gambar" },
            { type: "text", key: "alt", label: "Deskripsi gambar (untuk pembaca layar)", required: true, max: 200 },
          ],
        },
      ],
    },
  },
  {
    key: "timeline",
    title: "Pengalaman",
    hint: "Garis waktu kerja, magang, dan pendidikan.",
    root: {
      type: "list",
      key: "",
      label: "Pengalaman",
      itemLabel: "Entri",
      titleKey: "title",
      max: 30,
      fields: [
        { type: "id", key: "id" },
        {
          type: "select",
          key: "kind",
          label: "Jenis",
          required: true,
          options: [
            { value: "magang", label: "Magang" },
            { value: "kerja", label: "Kerja" },
            { value: "studi", label: "Pendidikan" },
          ],
        },
        { type: "text", key: "period", label: "Periode", required: true, max: 60, hint: "Contoh: Des 2025 – Feb 2026" },
        { type: "text", key: "title", label: "Posisi / jurusan", required: true, max: 120, hint: "Tulis (magang) bila statusnya magang." },
        { type: "text", key: "org", label: "Perusahaan / kampus", required: true, max: 160 },
        { type: "select", key: "projectId", label: "Proyek terkait (tombol Lihat proyek)", options: [], optionsFrom: "projects" },
        { type: "url", key: "proofUrl", label: "Tautan dokumen bukti", hint: "Kosongkan untuk menyembunyikan tombol." },
      ],
    },
  },
  {
    key: "skills",
    title: "Keahlian",
    hint: "Kelompok keahlian dan alat beserta chip-nya.",
    root: {
      type: "list",
      key: "",
      label: "Keahlian",
      itemLabel: "Kelompok",
      titleKey: "title",
      min: 1,
      max: 6,
      fields: [
        { type: "id", key: "id" },
        { type: "text", key: "title", label: "Nama kelompok", required: true, max: 60 },
        {
          type: "list",
          key: "items",
          label: "Isi kelompok",
          itemLabel: "Chip",
          titleKey: "label",
          max: 30,
          fields: [
            { type: "text", key: "label", label: "Nama", required: true, max: 60 },
            { type: "bool", key: "learning", label: "Sedang dipelajari" },
          ],
        },
      ],
    },
  },
  {
    key: "certificates",
    title: "Sertifikat",
    hint: "Kartu sertifikat dengan tautan dokumennya.",
    root: {
      type: "list",
      key: "",
      label: "Sertifikat",
      itemLabel: "Sertifikat",
      titleKey: "title",
      max: 30,
      fields: [
        { type: "text", key: "mark", label: "Label penerbit (di kartu)", required: true, max: 20, hint: "Contoh: Udemy, Cisco" },
        { type: "text", key: "category", label: "Kategori", max: 40 },
        { type: "text", key: "title", label: "Judul sertifikat", required: true, max: 120 },
        { type: "text", key: "issuer", label: "Penyelenggara / instruktur", max: 120 },
        { type: "url", key: "url", label: "Tautan dokumen sertifikat", required: true },
      ],
    },
  },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s])) as Record<ContentKey, SectionSpec>;
export const CONTENT_KEYS = SECTIONS.map((s) => s.key);
export const isContentKey = (value: string): value is ContentKey => (CONTENT_KEYS as string[]).includes(value);

/** Isi bawaan, dipakai bila database kosong atau tidak terjangkau. */
export const DEFAULTS: Record<ContentKey, unknown> = {
  site: defaultSite,
  stats: defaultStats,
  timeline: defaultTimeline,
  skills: defaultSkillGroups,
  certificates: defaultCertificates,
  projects: defaultProjects,
};

// ---------- pembuat item kosong (untuk tombol "Tambah") ----------

export const newId = () => Math.random().toString(36).slice(2, 9);

export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      return "";
    case "number":
      return field.min ?? 0;
    case "bool":
      return false;
    case "select":
      return field.optionsFrom || !field.required ? "" : (field.options[0]?.value ?? "");
    case "lines":
      return [];
    case "id":
      return newId();
    case "image":
      return "";
    case "list":
      return [];
    case "group":
      return emptyObject(field.fields);
  }
}

export function emptyObject(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "image") {
      out[f.key] = "";
      out.width = 0;
      out.height = 0;
    } else {
      out[f.key] = emptyValue(f);
    }
  }
  return out;
}

// ---------- validasi dan pembersihan ----------

interface Ctx {
  errors: string[];
  path: string[];
  /** true = buang entri yang tidak valid (untuk data dari database), false = laporkan sebagai kesalahan */
  lenient: boolean;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isHttp = (v: string) => /^https?:\/\/[^\s]+$/i.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isImageSrc = (v: string) => isHttp(v) || /^\/[^\s]+$/.test(v);

function fail(ctx: Ctx, message: string) {
  ctx.errors.push(ctx.path.length ? `${ctx.path.join(" › ")}: ${message}` : message);
}

function sanitizeGroup(fields: Field[], value: unknown, ctx: Ctx): Record<string, unknown> {
  const input = isRecord(value) ? value : {};
  const out: Record<string, unknown> = {};

  for (const f of fields) {
    if (f.type === "id") {
      out[f.key] = clean(input[f.key], 64).replace(/[^A-Za-z0-9_-]/g, "") || newId();
      continue;
    }
    ctx.path.push(f.label);
    if (f.type === "image") {
      const src = clean(input[f.key], 1000);
      if (!src) fail(ctx, "wajib diunggah");
      else if (!isImageSrc(src)) fail(ctx, "alamat gambar tidak valid");
      const w = Math.round(Number(input.width));
      const h = Math.round(Number(input.height));
      out[f.key] = src;
      out.width = Number.isFinite(w) && w > 0 ? Math.min(w, 10000) : 1200;
      out.height = Number.isFinite(h) && h > 0 ? Math.min(h, 10000) : 800;
    } else {
      const result = sanitizeField(f, input[f.key], ctx);
      if (result !== undefined) out[f.key] = result;
    }
    ctx.path.pop();
  }
  return out;
}

function sanitizeField(f: Field, value: unknown, ctx: Ctx): unknown {
  switch (f.type) {
    case "text": {
      const s = clean(value, f.max ?? (f.multiline ? 2000 : 300));
      if (!s) {
        if (f.required) fail(ctx, "wajib diisi");
        return f.required ? "" : undefined;
      }
      return s;
    }
    case "url": {
      const s = clean(value, 1000);
      if (!s) {
        if (f.required) fail(ctx, "wajib diisi");
        return f.required ? "" : undefined;
      }
      if (!isHttp(s)) fail(ctx, "harus berupa tautan yang diawali https://");
      return s;
    }
    case "email": {
      const s = clean(value, 200);
      if (!s) {
        if (f.required) fail(ctx, "wajib diisi");
        return "";
      }
      if (!isEmail(s)) fail(ctx, "format email tidak valid");
      return s;
    }
    case "number": {
      const n =
        typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value.trim()) : NaN;
      if (!Number.isFinite(n)) {
        if (f.required) fail(ctx, "wajib berupa angka");
        return f.required ? (f.min ?? 0) : undefined;
      }
      const rounded = Math.round(n);
      const lo = f.min ?? -Infinity;
      const hi = f.max ?? Infinity;
      if (rounded < lo || rounded > hi) fail(ctx, `harus antara ${f.min ?? "-∞"} dan ${f.max ?? "∞"}`);
      return Math.min(Math.max(rounded, lo), hi);
    }
    case "bool":
      return value === true ? true : undefined;
    case "select": {
      const s = clean(value, 64);
      if (!s) {
        if (f.required) fail(ctx, "wajib dipilih");
        return f.required ? (f.options[0]?.value ?? "") : undefined;
      }
      if (!f.optionsFrom && !f.options.some((o) => o.value === s)) {
        fail(ctx, "pilihan tidak dikenal");
        return f.options[0]?.value ?? "";
      }
      return s;
    }
    case "lines": {
      const arr = Array.isArray(value) ? value : [];
      return arr
        .map((v) => clean(v, 200))
        .filter(Boolean)
        .slice(0, 50);
    }
    case "group": {
      return sanitizeGroup(f.fields, value, ctx);
    }
    case "list": {
      const arr = Array.isArray(value) ? value : [];
      const limit = f.max ?? 100;
      if (!ctx.lenient && arr.length > limit) fail(ctx, `maksimal ${limit} item`);
      const idField = f.fields.find((x) => x.type === "id");
      const seen = new Set<string>();
      const items: Record<string, unknown>[] = [];
      arr.slice(0, limit).forEach((raw, i) => {
        const before = ctx.errors.length;
        ctx.path.push(`${f.itemLabel} ${i + 1}`);
        const item = sanitizeGroup(f.fields, raw, ctx);
        ctx.path.pop();
        if (ctx.lenient && ctx.errors.length > before) {
          ctx.errors.length = before;
          return;
        }
        if (idField) {
          let id = String(item[idField.key]);
          while (seen.has(id)) id = `${id}-${newId().slice(0, 3)}`;
          seen.add(id);
          item[idField.key] = id;
        }
        items.push(item);
      });
      if (f.min && items.length < f.min) fail(ctx, `minimal ${f.min} item`);
      return items;
    }
    case "id":
    case "image":
      return undefined;
  }
}

export interface SanitizeResult {
  value: unknown;
  errors: string[];
}

/** Bersihkan satu bagian. Mode `lenient` membuang entri rusak; mode ketat melaporkan semua kesalahan. */
export function sanitizeSection(key: ContentKey, raw: unknown, lenient = false): SanitizeResult {
  const spec = SECTION_BY_KEY[key];
  const ctx: Ctx = { errors: [], path: [], lenient };
  let value = sanitizeField(spec.root, raw, ctx);

  if (key === "site" && isRecord(value)) {
    // alamat situs tidak bisa diubah dari admin
    value = { ...value, url: defaultSite.url };
  }
  if (key === "projects" && Array.isArray(value)) {
    value = value.map((p) => {
      const project = p as Record<string, unknown>;
      const count = Array.isArray(project.gallery) ? project.gallery.length : 0;
      const wanted = Number(project.previewImages) || 1;
      return { ...project, previewImages: Math.max(1, Math.min(wanted, count || 1)) };
    });
  }
  return { value, errors: ctx.errors };
}
