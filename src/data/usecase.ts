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

/** Contoh hasil diagnosa untuk layar "Hasil diagnosa" (ilustrasi). */
export const diagnosisResults: { name: string; percent: number }[] = [
  { name: "Goresan permukaan", percent: 86 },
  { name: "Dimensi di luar toleransi", percent: 61 },
  { name: "Warna tidak merata", percent: 34 },
];
