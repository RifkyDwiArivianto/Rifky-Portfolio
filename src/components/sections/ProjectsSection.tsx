import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section id="proyek">
      <SectionHead eyebrow="Proyek" title="Yang pernah saya bangun" />
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
