import type { Project } from "@/types";
import { ProjectStage } from "./ProjectStage";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project${project.flip ? " flip" : ""}`}>
      <ProjectStage project={project} />
      <div>
        <h3>{project.title}</h3>
        <p className="org">{project.org}</p>
        <p>{project.description}</p>
        <ul className="roles">
          {project.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <div className="toolrow">
          <span className="lbl">Tools</span>
          <ul className="tags">
            {project.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
