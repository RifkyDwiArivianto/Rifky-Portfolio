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

export type TimelineKind = "kerja" | "studi";

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  /** id proyek yang dibuka lewat tombol "Lihat proyek" */
  projectId?: string;
  proofUrl: string;
}

export interface Stat {
  value: number;
  decimals?: number;
  label: string;
}

export type SkillGroupId = "ah" | "al";

export interface SkillItem {
  label: string;
  learning?: boolean;
}

export interface SkillGroup {
  id: SkillGroupId;
  title: string;
  items: SkillItem[];
}

export interface Certificate {
  mark: string;
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
