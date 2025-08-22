import * as React from "react";
import type { Center, Project, Tag } from "@/types";
import { ProjectCard } from "@/components/ProjectCard";

type Props = {
  projects: Project[];
  centers: Center[];
  tags: Tag[];
};

export const ProjectsGrid: React.FC<Props> = ({ projects, centers, tags }) => {
  const centerMap = React.useMemo(
    () => new Map(centers.map((c) => [c.id, c] as const)),
    [centers]
  );
  const tagMap = React.useMemo(
    () => new Map(tags.map((t) => [t.id, t] as const)),
    [tags]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Projetos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((p) => {
          const projectTags = p.tagIds
            .map((id) => tagMap.get(id))
            .filter(Boolean) as Tag[];

          return (
            <ProjectCard
              key={p.id}
              project={p}
              center={centerMap.get(p.centerId)}
              tags={projectTags}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsGrid;
