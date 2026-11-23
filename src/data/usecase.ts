import type { UseCase, UseCaseActor } from "@/types";

export const useCases: UseCase[] = [
  { title: ["Memeriksa", "Penemuan"], y: 50, url: "pemeriksaan", actors: ["Operator Produksi", "QC Inspector"] },
  { title: ["Melakukan", "Diagnosa"], y: 130, url: "diagnosa", actors: ["QC Inspector"] },
  { title: ["Melaporkan"], y: 210, url: "laporan", actors: ["QC Inspector", "QC Supervisor"] },
  { title: ["Memverifikasi", "Laporan"], y: 290, url: "verifikasi", actors: ["QC Supervisor", "Manager Quality"] },
];

export const useCaseActors: UseCaseActor[] = [
  { name: "Operator Produksi", x: 52, y: 48, label: ["Operator", "Produksi"] },
  { name: "QC Inspector", x: 430, y: 92, label: ["QC", "Inspector"] },
  { name: "QC Supervisor", x: 430, y: 210, label: ["QC", "Supervisor"] },
  { name: "Manager Quality", x: 430, y: 304, label: ["Manager", "Quality"] },
];

/** Contoh hasil diagnosa untuk layar "Hasil diagnosa" (ilustrasi). */
export const diagnosisResults: { name: string; percent: number }[] = [
  { name: "Goresan permukaan", percent: 86 },
  { name: "Dimensi di luar toleransi", percent: 61 },
  { name: "Warna tidak merata", percent: 34 },
];
