import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { centers, projects, tags } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DetailSkeleton } from "@/components/Skeletons";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const project = React.useMemo(
    () => projects.find((p) => p.id === id),
    [id]
  );
  const center = React.useMemo(
    () => centers.find((c) => c.id === project?.centerId),
    [project]
  );

  const pageTitle = project ? `${project.name} • UniLink` : "Projeto • UniLink";

  if (!loading && !project) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
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
        <meta name="description" content={project?.description ?? "Projeto"} />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" aria-labelledby="project-title">
        {loading || !project ? (
          <DetailSkeleton />
        ) : (
          <>
            {/* Título central */}
            <h1 id="project-title" className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center">
              {project.name}
            </h1>

            {/* Badge "Inscrições abertas!" */}
            {project.openForApplications && (
              <Badge
                className="mx-auto mt-4 block"
                aria-label="Inscrições abertas!"
              >
                Inscrições abertas!
              </Badge>
            )}

            <Separator className="my-8" />

            {/* Grid 2 colunas em md+ */}
            <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
              {/* Imagem grande (esquerda) */}
              <div className="w-full">
                <div className="relative w-full rounded-3xl shadow-sm overflow-hidden aspect-square md:aspect-[4/3]">
                  <Image
                    src={project.imgUrl}
                    alt={`${project.name} - imagem do projeto`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Cards à direita */}
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
                        {center?.name ?? "—"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Navegação de volta (acessível) */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/"
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="Voltar para a página inicial de projetos"
              >
                Voltar para projetos
              </Link>
            </div>
          </>
        )}
      </main>

      {/* TODO (integração backend):
          - Substituir busca local por GET /api/projects/{id} do ProjectController.
          - Manter fallback 404 para ids inexistentes. */}
    </>
  );
}
