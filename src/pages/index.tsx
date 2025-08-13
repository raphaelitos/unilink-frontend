import * as React from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { TagFilters } from "@/components/TagFilters";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { EmptyState } from "@/components/EmptyState";
import { ProjectsSkeleton, TagsSkeleton } from "@/components/Skeletons";
import type { Center, Project, Tag, UUID } from "@/types";
import { Separator } from "@/components/ui/separator";


const centers: Center[] = [
  { id: "ctr-tech", name: "Centro Tecnológico", centerUrl: "#" },
  { id: "ctr-art", name: "Centro de Artes", centerUrl: "#" },
  { id: "ctr-hs", name: "Centro de Humanidades", centerUrl: "#" },
  { id: "ctr-health", name: "Centro de Ciências da Saúde", centerUrl: "#" },
];

const tags: Tag[] = [
  { id: "t-ai", name: "IA", colorHex: "#8B5CF6" },
  { id: "t-web", name: "Web", colorHex: "#06B6D4" },
  { id: "t-ml", name: "ML", colorHex: "#10B981" },
  { id: "t-iot", name: "IoT", colorHex: "#F59E0B" },
  { id: "t-data", name: "Dados", colorHex: "#3B82F6" },
  { id: "t-design", name: "Design", colorHex: "#EC4899" },
  { id: "t-edu", name: "Educação", colorHex: "#A3E635" },
  { id: "t-saude", name: "Saúde", colorHex: "#EF4444" },
  { id: "t-robot", name: "Robótica", colorHex: "#22C55E" },
  { id: "t-sust", name: "Sustentabilidade", colorHex: "#84CC16" },
];

const projects: Project[] = [
  {
    id: "p1",
    name: "Plataforma Tutoria Inteligente",
    description:
      "Sistema de recomendação de trilhas de estudo personalizado para calouros, com analytics e intervenções proativas.",
    centerId: "ctr-hs",
    ownerId: "u1",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p1/640/360",
    teamSize: 6,
    tagIds: ["t-ai", "t-ml", "t-edu"],
  },
  {
    id: "p2",
    name: "Observatório de Dados Urbanos",
    description:
      "Coleta de dados georreferenciados e painéis de visualização para mobilidade e segurança pública.",
    centerId: "ctr-tech",
    ownerId: "u2",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p2/640/360",
    teamSize: 8,
    tagIds: ["t-data", "t-web"],
  },
  {
    id: "p3",
    name: "Arte Generativa Interativa",
    description:
      "Instalação artística com algoritmos generativos e sensores de movimento para exposições itinerantes.",
    centerId: "ctr-art",
    ownerId: "u3",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p3/640/360",
    teamSize: 4,
    tagIds: ["t-design", "t-ai", "t-iot"],
  },
  {
    id: "p4",
    name: "Monitoramento de Estufas IoT",
    description:
      "Rede de sensores para controle climático e otimização de cultivo em pequenas propriedades.",
    centerId: "ctr-tech",
    ownerId: "u4",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p4/640/360",
    teamSize: 5,
    tagIds: ["t-iot", "t-robot", "t-sust"],
  },
  {
    id: "p5",
    name: "Clínica Digital Preventiva",
    description:
      "Aplicativo para triagem e acompanhamento de sinais vitais com foco em prevenção.",
    centerId: "ctr-health",
    ownerId: "u5",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p5/640/360",
    teamSize: 7,
    tagIds: ["t-saude", "t-data", "t-ml"],
  },
  {
    id: "p6",
    name: "Robô Guia de Biblioteca",
    description:
      "Plataforma robótica autônoma para auxílio na localização de acervo físico.",
    centerId: "ctr-tech",
    ownerId: "u6",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p6/640/360",
    teamSize: 5,
    tagIds: ["t-robot", "t-iot"],
  },
  {
    id: "p7",
    name: "Portal Acessível de Cultura",
    description:
      "Repositório digital de eventos culturais com navegação acessível e tradução automática.",
    centerId: "ctr-art",
    ownerId: "u7",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p7/640/360",
    teamSize: 6,
    tagIds: ["t-web", "t-design"],
  },
  {
    id: "p8",
    name: "Oficina Sustentável Maker",
    description:
      "Laboratório de prototipagem com foco em reciclagem de materiais e energia limpa.",
    centerId: "ctr-tech",
    ownerId: "u8",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p8/640/360",
    teamSize: 10,
    tagIds: ["t-sust", "t-design"],
  },
  {
    id: "p9",
    name: "Núcleo de Estudos de Aprendizado",
    description:
      "Grupo de pesquisa em modelos de linguagem e aplicações na educação.",
    centerId: "ctr-hs",
    ownerId: "u9",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p9/640/360",
    teamSize: 9,
    tagIds: ["t-edu", "t-ml", "t-ai"],
  },
  {
    id: "p10",
    name: "Dashboard de Saúde Pública",
    description:
      "Painel interativo para acompanhamento de indicadores de saúde municipais.",
    centerId: "ctr-health",
    ownerId: "u10",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p10/640/360",
    teamSize: 6,
    tagIds: ["t-saude", "t-data", "t-web"],
  },
  {
    id: "p11",
    name: "Trilhas EAD Inclusivas",
    description:
      "Design instrucional orientado por dados para acessibilidade em cursos online.",
    centerId: "ctr-hs",
    ownerId: "u11",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p11/640/360",
    teamSize: 5,
    tagIds: ["t-edu", "t-design", "t-web"],
  },
  {
    id: "p12",
    name: "Enxame de Drones Didáticos",
    description:
      "Kit de drones de baixo custo para atividades práticas em disciplinas de controle.",
    centerId: "ctr-tech",
    ownerId: "u12",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p12/640/360",
    teamSize: 8,
    tagIds: ["t-robot", "t-iot", "t-edu"],
  },
  {
    id: "p13",
    name: "Museu Virtual Interativo",
    description:
      "Exibições 3D e tours virtuais com curadoria colaborativa.",
    centerId: "ctr-art",
    ownerId: "u13",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p13/640/360",
    teamSize: 7,
    tagIds: ["t-web", "t-design", "t-data"],
  },
  {
    id: "p14",
    name: "Prevenção de Quedas com Wearables",
    description:
      "Análise de marcha e alertas em tempo real para idosos usando sensores vestíveis.",
    centerId: "ctr-health",
    ownerId: "u14",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p14/640/360",
    teamSize: 6,
    tagIds: ["t-saude", "t-iot", "t-ml"],
  },
  {
    id: "p15",
    name: "Mapa Verde do Campus",
    description:
      "Mapeamento colaborativo de áreas verdes e trilhas ecológicas.",
    centerId: "ctr-tech",
    ownerId: "u15",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/p15/640/360",
    teamSize: 4,
    tagIds: ["t-sust", "t-web", "t-data"],
  },
  {
    id: "p16",
    name: "Assistente Acadêmico Conversacional",
    description:
      "Agente que responde dúvidas sobre disciplinas, prazos e eventos do centro.",
    centerId: "ctr-hs",
    ownerId: "u16",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/p16/640/360",
    teamSize: 5,
    tagIds: ["t-ai", "t-edu", "t-web"],
  },
];

export default function HomePage() {
  const [selectedTagIds, setSelectedTagIds] = React.useState<UUID[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openOnly, setOpenOnly] = React.useState<boolean>(false);

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
        <section
          aria-labelledby="filters-heading"
          className="mt-6 sm:mt-8"
        >
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
            <ProjectsGrid
              projects={filteredProjects}
              centers={centers}
              tags={tags}
            />
          )}
        </section>
      </main>
    </>
  );
}
