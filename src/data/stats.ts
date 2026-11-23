import type { Stat } from "@/types";
import { certificates } from "./certificates";
import { site } from "./site";

export const stats: Stat[] = [
  { value: 3.61, decimals: 2, label: "IPK" },
  { value: site.year, label: "Tahun lulus" },
  { value: certificates.length, label: "Sertifikat" },
];
