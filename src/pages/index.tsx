import * as React from "react";
import Head from "next/head";
import { AxiosError } from "axios";

import { Header } from "@/components/Header";
import { TagFilters } from "@/components/TagFilters";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { EmptyState } from "@/components/EmptyState";
import { ProjectsSkeleton, TagsSkeleton } from "@/components/Skeletons";
import { Separator } from "@/components/ui/separator";

import type { UUID, ApiTag, ApiProjectDetailed, ProjectQueryFilter } from "@/types/project";
import { getTags } from "@/lib/api";
import { getProjects } from "@/lib/projects";
import { dedupeUUIDs } from "@/lib/tags";

export default function HomePage() {
  const [selectedTagIds, setSelectedTagIds] = React.useState<UUID[]>([]);
  const [openOnly, setOpenOnly] = React.useState<boolean>(false);

  const [tags, setTags] = React.useState<ApiTag[]>([]);
  const [projects, setProjects] = React.useState<ApiProjectDetailed[]>([]);

  const [loadingTags, setLoadingTags] = React.useState(true);
  const [loadingProjects, setLoadingProjects] = React.useState(true);

  const [errorTags, setErrorTags] = React.useState<string | null>(null);
  const [errorProjects, setErrorProjects] = React.useState<string | null>(null);

  // Helpers para mensagens de erro
  const extractMessage = (err: unknown, fallback: string) => {
    const ax = err as AxiosError<{ message?: string; error?: string }>;
    return ax?.response?.data?.message || ax?.response?.data?.error || (err as Error)?.message || fallback;
  };

  const loadTags = React.useCallback(async () => {
    setLoadingTags(true);
    setErrorTags(null);
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      setErrorTags(extractMessage(err, "Falha ao carregar tags"));
    } finally {
      setLoadingTags(false);
    }
  }, []);

  const loadProjects = React.useCallback(
    async (filter?: ProjectQueryFilter) => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const data = await getProjects(filter);
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorProjects(extractMessage(err, "Falha ao carregar projetos"));
      } finally {
        setLoadingProjects(false);
      }
    },
    []
  );

  // Carrega tags na montagem
  React.useEffect(() => {
    void loadTags();
  }, [loadTags]);

  // Carrega projetos sempre que filtros mudarem
  React.useEffect(() => {
  const safeTagIds = dedupeUUIDs(selectedTagIds);

  const filter: ProjectQueryFilter | undefined =
    safeTagIds.length > 0 || openOnly
      ? {
          tagIds: safeTagIds.length > 0 ? safeTagIds : undefined,
          openForApplications: openOnly ? true : undefined,
        }
      : undefined;

  void loadProjects(filter);
}, [selectedTagIds, openOnly, loadProjects]);

  const onToggleTag = React.useCallback((id: UUID) => {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }, []);

  const pageTitle = "UFES • UniLink";

  const isLoadingAll = loadingTags || loadingProjects;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="UniLink • Portais e projetos da UFES" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <section aria-labelledby="filters-heading" className="mt-6 sm:mt-8">
          <h2 id="filters-heading" className="sr-only">
            Filtros
          </h2>

          {loadingTags ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded bg-muted animate-pulse" />
                <div className="h-5 w-40 rounded bg-muted animate-pulse" />
              </div>
              <TagsSkeleton />
            </div>
          ) : errorTags ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{errorTags}</p>
              <button
                type="button"
                onClick={() => void loadTags()}
                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                Tentar novamente
              </button>
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

          {isLoadingAll ? (
            <ProjectsSkeleton count={8} />
          ) : errorProjects ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{errorProjects}</p>
              <button
                type="button"
                onClick={() => {
                  const filter: ProjectQueryFilter | undefined =
                    selectedTagIds.length > 0 || openOnly
                      ? {
                          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
                          openForApplications: openOnly ? true : undefined,
                        }
                      : undefined;
                  void loadProjects(filter);
                }}
                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                Tentar novamente
              </button>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectsGrid projects={projects} />
          )}
        </section>
      </main>
    </>
  );
}
