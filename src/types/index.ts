export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  title: string;
  org: string;
  description: string;
  roles: string[];
  tools: string[];
  /** "wide" = satu tangkapan layar lebar, "phones" = tiga layar ponsel berjajar */
  preview: "wide" | "phones";
  /** balik urutan kolom (gambar di kanan) pada layar lebar */
  flip?: boolean;
  /** gambar yang tampil sebagai pratinjau; sisanya hanya ada di galeri */
  previewImages: number;
  gallery: GalleryImage[];
}

export type TimelineKind = "magang" | "kerja" | "studi";

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  /** id proyek yang dibuka lewat tombol "Lihat proyek" */
  projectId?: string;
  /** tautan dokumen bukti; tombol "Lihat dokumen" hanya muncul bila diisi */
  proofUrl?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillItem {
  label: string;
  learning?: boolean;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: SkillItem[];
}

export interface Certificate {
  /** label penerbit di bagian atas kartu */
  mark: string;
  category?: string;
  title: string;
  issuer: string;
  url: string;
}

export interface UseCase {
  title: string[];
  y: number;
  url: string;
  actors: string[];
}

export interface UseCaseActor {
  name: string;
  x: number;
  y: number;
  label: string[];
}

export type ReviewStatus = "Menunggu" | "Disetujui" | "Ditolak";

export interface SiteInfo {
  name: string;
  shortName: string;
  url: string;
  role: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  whatsapp: { href: string; label: string };
  year: number;
  heroTools: string[];
  /** paragraf di bagian Kontak */
  contactNote: string;
}
