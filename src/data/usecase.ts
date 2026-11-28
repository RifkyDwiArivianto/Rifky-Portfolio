import type { UseCase, UseCaseActor } from "@/types";

export const useCases: UseCase[] = [
  { title: ["Memeriksa", "Penemuan"], y: 50, url: "pemeriksaan", actors: ["Operator Produksi", "QC Inspector"] },
  { title: ["Melakukan", "Diagnosa"], y: 135, url: "diagnosa", actors: ["QC Inspector"] },
  { title: ["Melaporkan"], y: 220, url: "laporan", actors: ["QC Inspector", "QC Supervisor"] },
  { title: ["Memverifikasi", "Laporan"], y: 305, url: "verifikasi", actors: ["QC Supervisor", "Manager Quality"] },
];

export const useCaseActors: UseCaseActor[] = [
  { name: "Operator Produksi", x: 52, y: 50, label: ["Operator", "Produksi"] },
  { name: "QC Inspector", x: 430, y: 90, label: ["QC", "Inspector"] },
  { name: "QC Supervisor", x: 430, y: 205, label: ["QC", "Supervisor"] },
  { name: "Manager Quality", x: 430, y: 330, label: ["Manager", "Quality"] },
];

/** Penyimpangan yang mungkin didiagnosa. */
export const deviations = ["Goresan permukaan", "Dimensi di luar toleransi", "Warna tidak merata"];

/**
 * Gejala yang bisa dicentang di layar pemeriksaan. Nilai CF pakar dan pemetaan ke penyimpangan
 * adalah CONTOH untuk simulasi, bukan data dari sistem sebenarnya.
 */
export const symptoms: { name: string; expert: number; target: number }[] = [
  { name: "Permukaan tergores", expert: 0.8, target: 0 },
  { name: "Ada bekas gesekan", expert: 0.6, target: 0 },
  { name: "Ukuran melebihi toleransi", expert: 0.9, target: 1 },
  { name: "Bentuk melengkung", expert: 0.5, target: 1 },
  { name: "Warna tidak merata", expert: 0.7, target: 2 },
  { name: "Permukaan kusam", expert: 0.4, target: 2 },
];

/** Tingkat keyakinan operator terhadap gejala yang dipilih (CF pengguna). */
export const confidenceLevels: { label: string; value: number }[] = [
  { label: "Yakin", value: 1 },
  { label: "Cukup", value: 0.6 },
  { label: "Ragu", value: 0.3 },
];
