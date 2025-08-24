import * as React from "react";
import type { ApiProjectDetailed } from "@/types/project";
import { ProjectCard } from "@/components/ProjectCard";

type Props = {
  projects: ApiProjectDetailed[];
};

export const ProjectsGrid: React.FC<Props> = ({ projects }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Projetos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;
