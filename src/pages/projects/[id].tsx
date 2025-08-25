import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectDetailSkeleton } from "@/components/Skeletons";

import { getProjectById } from "@/lib/projects";
import type { ApiProjectDetailed, ApiTag } from "@/types/project";
import { getReadableTextColor, withAlpha } from "@/lib/colors";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState<ApiProjectDetailed | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  const fetchProject = React.useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          const msg =
            (err.response?.data as { message?: string; error?: string })?.message ||
            (err.response?.data as { error?: string })?.error ||
            err.message ||
            "Falha ao carregar projeto.";
          setError(msg);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Falha ao carregar projeto.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!id) return;
    if (!uuidRegex.test(id)) {
      setLoading(false);
      setProject(null);
      setNotFound(true);
      return;
    }
    void fetchProject(id);
  }, [id, fetchProject]);

  const metaDescription =
    project?.description ? project.description.slice(0, 160) : "Projeto";
  const pageTitle = project ? `${project.name} • UniLink` : "Projeto • UniLink";

  if (!loading && notFound) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-center">
            Projeto não encontrado
          </h1>
          <p className="text-center text-muted-foreground mt-3">
            O projeto solicitado não existe ou foi removido.
          </p>
          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Voltar para projetos
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <Header />

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        aria-labelledby="project-title"
      >
        {loading || !project ? (
          <ProjectDetailSkeleton />
        ) : (
          <>
            <h1
              id="project-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center"
            >
              {project.name}
            </h1>

            {project.openForApplications && (
              <div className="flex justify-center mt-4">
                <Badge
                  className="inline-flex items-center px-3 py-1 w-fit"
                  aria-label="Inscrições abertas!"
                >
                  Inscrições abertas!
                </Badge>
              </div>
            )}

            {/* Tags (até 3 + N) */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex justify-center mt-3">
                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.slice(0, 3).map((tag: ApiTag) => {
                    const textColor = getReadableTextColor(tag.colorHex);
                    return (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                        style={{
                          backgroundColor: withAlpha(tag.colorHex, 0.15),
                          color: textColor === "white" ? "#ffffff" : "#111827",
                          border: `1px solid ${withAlpha(tag.colorHex, 0.35)}`,
                        }}
                        aria-label={`Tag ${tag.name}`}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                  {project.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <p className="text-sm text-destructive text-center">{error}</p>
                <button
                  type="button"
                  onClick={() => id && fetchProject(id)}
                  className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <Separator className="my-8" />

            <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
              <div className="w-full">
                <div className="relative w-full rounded-3xl shadow-sm overflow-hidden aspect-square md:aspect-[4/3]">
                  {project.imgUrl ? (
                    <Image
                      src={project.imgUrl}
                      alt={`${project.name} - imagem do projeto`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Descrição</div>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-base leading-relaxed">{project.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Departamento</div>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-base leading-relaxed">
                        {project.center?.name ?? "—"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/"
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="Voltar para a página inicial de projetos"
              >
                Ver outros projetos
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
