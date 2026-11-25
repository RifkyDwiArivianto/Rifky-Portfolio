import type { Project } from "@/types";

const img = (file: string) => `/images/projects/${file}`;

export const projects: Project[] = [
  {
    id: "diagnosa",
    title: "Sistem Diagnosa Penyimpangan Produk",
    org: "PT. Metinca Prima Industrial Works · divisi Quality Assurance",
    description:
      "Aplikasi web internal yang mendiagnosa penyimpangan produk dengan metode Certainty Factor.",
    roles: ["Merancang alur sistem", "Membangun antarmuka", "Mengelola database"],
    tools: ["Laravel", "MySQL", "Enterprise Architect"],
    preview: "wide",
    previewImages: 1,
    gallery: [
      {
        src: img("diagnosa-aplikasi.webp"),
        alt: "Tampilan aplikasi Sistem Diagnosa Penyimpangan Produk",
        width: 1200,
        height: 606,
      },
      {
        src: img("diagnosa-usecase.jpg"),
        alt: "Diagram use case: Rancang Bangun Sistem Pakar Diagnosa Penyimpangan Produk",
        width: 372,
        height: 360,
      },
    ],
  },
  {
    id: "wander",
    title: "Wanderbliss",
    org: "PT. Cakra Wijaya Solusi",
    description: "Proyek desain UI aplikasi Wanderbliss selama magang sebagai UI/UX Designer.",
    roles: ["Merancang layar login", "Merancang halaman rekomendasi", "Merancang beranda destinasi populer"],
    tools: ["Figma"],
    preview: "phones",
    flip: true,
    previewImages: 3,
    gallery: [
      { src: img("wanderbliss-1.webp"), alt: "Layar Wanderbliss 1", width: 720, height: 1560 },
      { src: img("wanderbliss-2.webp"), alt: "Layar Wanderbliss 2", width: 720, height: 1560 },
      { src: img("wanderbliss-3.webp"), alt: "Layar Wanderbliss 3", width: 720, height: 1560 },
    ],
  },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
