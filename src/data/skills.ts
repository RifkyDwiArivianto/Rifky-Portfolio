import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    id: "ah",
    title: "Keahlian",
    items: [
      { label: "Web development" },
      { label: "Manajemen database" },
      { label: "Analisis dan perancangan sistem" },
      { label: "Desain UI/UX" },
    ],
  },
  {
    id: "al",
    title: "Peralatan",
    items: [
      { label: "Laravel" },
      { label: "MySQL" },
      { label: "VS Code" },
      { label: "Enterprise Architect" },
      { label: "Figma" },
      { label: "Next.js (belajar)", learning: true },
    ],
  },
];
