import * as React from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { TagFilters } from "@/components/TagFilters";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { EmptyState } from "@/components/EmptyState";
import { ProjectsSkeleton, TagsSkeleton } from "@/components/Skeletons";
import type { UUID } from "@/types";
import { Separator } from "@/components/ui/separator";
import { centers, tags, projects } from "@/lib/mock";

export default function HomePage() {
  const [selectedTagIds, setSelectedTagIds] = React.useState<UUID[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  // Apenas visual (não aplica filtro real nesta etapa)
  const [openOnly, setOpenOnly] = React.useState<boolean>(false);

  // Simula carregamento para demonstrar skeletons (~500ms)
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const onToggleTag = React.useCallback((id: UUID) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  // Filtragem AND: se nenhuma tag selecionada, retorna todos;
  // caso contrário, o projeto deve conter TODAS as tags selecionadas.
  const filteredProjects = React.useMemo(() => {
    if (selectedTagIds.length === 0) return projects;
    return projects.filter((p) =>
      selectedTagIds.every((tid) => p.tagIds.includes(tid))
    );
  }, [selectedTagIds]);

  return (
    <>
      <Head>
        <title>UFES • UniLink</title>
        <meta name="description" content="UniLink • Portais e projetos da UFES" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <section aria-labelledby="filters-heading" className="mt-6 sm:mt-8">
          <h2 id="filters-heading" className="sr-only">
            Filtros
          </h2>

          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded bg-muted animate-pulse" />
                <div className="h-5 w-40 rounded bg-muted animate-pulse" />
              </div>
              <TagsSkeleton />
            </div>
          ) : (
            <TagFilters
              tags={tags}
              selectedTagIds={selectedTagIds}
              onToggleTag={onToggleTag}
              openOnly={openOnly}
              onToggleOpenOnly={() => setOpenOnly((v) => !v)}
            />
          )}
        </section>

        <Separator className="my-6" />

        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="sr-only">
            Projetos
          </h2>

          {loading ? (
            <ProjectsSkeleton count={8} />
          ) : filteredProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectsGrid projects={filteredProjects} centers={centers} tags={tags} />
          )}
        </section>
      </main>

      {/* TODO (integração backend):
          - Substituir mocks por GET /api/projects (ProjectController Spring).
          - Observação: hoje GET /api/projects aceita filtro no body (ProjectQueryFilter),
            avaliar adequação REST; se necessário, usar POST de busca no futuro. */}
    </>
  );
}
