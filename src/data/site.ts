import type { SiteInfo } from "@/types";

/** Isi bawaan. Bila Supabase terhubung, nilai dari mode admin (/admin) menggantikan ini. */
export const site: SiteInfo = {
  name: "Rifky Dwi Arivianto",
  shortName: "RDA",
  url: "https://rifkyportfolio.vercel.app",
  role: "Web developer dan analis sistem",
  description:
    "Lulusan Sistem Informasi Universitas Darma Persada. Saya merancang dan membangun aplikasi web dengan Laravel, MySQL, dan Next.js.",
  email: "rifkydwiarivianto2022@gmail.com",
  github: "https://github.com/RifkyDwiArivianto",
  linkedin: "https://www.linkedin.com/in/rifky-dwi-arivianto-71606234a/",
  whatsapp: { href: "https://wa.me/6281292192598", label: "0812-9219-2598" },
  year: 2026,
  heroTools: ["Laravel", "MySQL", "Figma", "Next.js"],
  contactNote:
    "Sedang terbuka untuk peran yang membangun aplikasi web, menganalisis kebutuhan sistem, dan mengelola basis data.",
};

export const navLinks = [
  { id: "proyek", label: "Proyek" },
  { id: "jalur", label: "Pengalaman" },
  { id: "sertifikat", label: "Sertifikat" },
  { id: "kontak", label: "Kontak" },
] as const;
