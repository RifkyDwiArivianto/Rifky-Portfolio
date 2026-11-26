import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Project } from "@/types";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="proyek">
      <SectionHead
        eyebrow="Proyek"
        title="Yang pernah saya bangun"
        intro="Klik pratinjau untuk memperbesar gambar, atau buka galeri untuk melihat lebih banyak layar."
      />
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
