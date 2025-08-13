import * as React from "react";
import Image from "next/image";
import type { Center, Project, Tag } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  project: Project;
  center?: Center;
  tags: Tag[]; // apenas as do projeto (máx 3 visíveis)
};

export const ProjectCard: React.FC<Props> = ({ project, center, tags }) => {
  const visibleTags = tags.slice(0, 3);
  const extra = tags.length - visibleTags.length;

  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-ring">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={project.imgUrl}
            alt={`Imagem do projeto ${project.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold leading-tight">{project.name}</h4>
          {project.openForApplications && (
            <Badge className="shrink-0" aria-label="Inscrições abertas">
              Inscrições abertas
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="text-sm">
          <span className="text-muted-foreground">Centro:</span>{" "}
          <span>{center?.name ?? "—"}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((t) => (
              <Badge
                key={t.id}
                variant="outline"
                style={{
                  backgroundColor: `${t.colorHex}20`,
                  borderColor: `${t.colorHex}55`,
                }}
                aria-label={`Tag ${t.name}`}
              >
                {t.name}
              </Badge>
            ))}
            {extra > 0 && (
              <Badge variant="secondary" aria-label={`Mais ${extra} tags`}>
                +{extra}
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">Equipe: {project.teamSize}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
