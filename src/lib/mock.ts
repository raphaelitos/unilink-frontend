import type { Center, Project, Tag } from "@/types";

// Centros
export const centers: Center[] = [
  { id: "1f5f9c36-8d9a-4a0a-85b6-f8f7a8a00001", name: "Centro Tecnológico", centerUrl: "#" },
  { id: "1f5f9c36-8d9a-4a0a-85b6-f8f7a8a00002", name: "Centro de Artes", centerUrl: "#" },
  { id: "1f5f9c36-8d9a-4a0a-85b6-f8f7a8a00003", name: "Centro de Humanidades", centerUrl: "#" },
  { id: "1f5f9c36-8d9a-4a0a-85b6-f8f7a8a00004", name: "Centro de Ciências da Saúde", centerUrl: "#" },
];

// Tags
export const tags: Tag[] = [
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000001", name: "IA", colorHex: "#8B5CF6" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000002", name: "Web", colorHex: "#06B6D4" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000003", name: "ML", colorHex: "#10B981" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000004", name: "IoT", colorHex: "#F59E0B" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000005", name: "Dados", colorHex: "#3B82F6" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000006", name: "Design", colorHex: "#EC4899" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000007", name: "Educação", colorHex: "#A3E635" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000008", name: "Saúde", colorHex: "#EF4444" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000009", name: "Robótica", colorHex: "#22C55E" },
  { id: "b9e1b8f1-c1a2-4c3d-8f1a-000000000010", name: "Sustentabilidade", colorHex: "#84CC16" },
];

// Projetos (5–8, imgs 800x600)
export const projects: Project[] = [
  {
    id: "6f6f0b1b-2d5a-4f4a-9d9b-111111111111",
    name: "Plataforma Tutoria Inteligente",
    description:
      "Sistema de recomendação de trilhas de estudo para calouros, com analytics e intervenções proativas.",
    centerId: centers[2].id, // Humanidades
    ownerId: "u1",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/6f6f0b1b/800/600",
    teamSize: 6,
    tagIds: [tags[0].id, tags[2].id, tags[6].id], // IA, ML, Educação
  },
  {
    id: "7c7c0b1b-2d5a-4f4a-9d9b-222222222222",
    name: "Observatório de Dados Urbanos",
    description: "Coleta de dados georreferenciados e painéis de mobilidade e segurança.",
    centerId: centers[0].id, // Tecnológico
    ownerId: "u2",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/7c7c0b1b/800/600",
    teamSize: 8,
    tagIds: [tags[4].id, tags[1].id], // Dados, Web
  },
  {
    id: "8d8d0b1b-2d5a-4f4a-9d9b-333333333333",
    name: "Arte Generativa Interativa",
    description: "Instalação artística com algoritmos generativos e sensores de movimento.",
    centerId: centers[1].id, // Artes
    ownerId: "u3",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/8d8d0b1b/800/600",
    teamSize: 4,
    tagIds: [tags[5].id, tags[0].id, tags[3].id], // Design, IA, IoT
  },
  {
    id: "9e9e0b1b-2d5a-4f4a-9d9b-444444444444",
    name: "Monitoramento de Estufas IoT",
    description: "Rede de sensores para controle climático e otimização de cultivo.",
    centerId: centers[0].id, // Tecnológico
    ownerId: "u4",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/9e9e0b1b/800/600",
    teamSize: 5,
    tagIds: [tags[3].id, tags[8].id, tags[9].id], // IoT, Robótica, Sustentabilidade
  },
  {
    id: "aaaa0b1b-2d5a-4f4a-9d9b-555555555555",
    name: "Clínica Digital Preventiva",
    description: "Triagem e acompanhamento de sinais vitais com foco em prevenção.",
    centerId: centers[3].id, // Saúde
    ownerId: "u5",
    openForApplications: false,
    imgUrl: "https://picsum.photos/seed/aaaa0b1b/800/600",
    teamSize: 7,
    tagIds: [tags[7].id, tags[4].id, tags[2].id], // Saúde, Dados, ML
  },
  {
    id: "bbbb0b1b-2d5a-4f4a-9d9b-666666666666",
    name: "Portal Acessível de Cultura",
    description: "Repositório de eventos culturais com navegação acessível.",
    centerId: centers[1].id, // Artes
    ownerId: "u6",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/bbbb0b1b/800/600",
    teamSize: 6,
    tagIds: [tags[1].id, tags[5].id], // Web, Design
  },
  {
    id: "cccc0b1b-2d5a-4f4a-9d9b-777777777777",
    name: "Prevenção de Quedas com Wearables",
    description: "Análise de marcha e alertas em tempo real para idosos.",
    centerId: centers[3].id, // Saúde
    ownerId: "u7",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/cccc0b1b/800/600",
    teamSize: 6,
    tagIds: [tags[7].id, tags[3].id, tags[2].id], // Saúde, IoT, ML
  },
  {
    id: "dddd0b1b-2d5a-4f4a-9d9b-888888888888",
    name: "Mapa Verde do Campus",
    description: "Mapeamento colaborativo de áreas verdes e trilhas ecológicas.",
    centerId: centers[0].id, // Tecnológico
    ownerId: "u8",
    openForApplications: true,
    imgUrl: "https://picsum.photos/seed/dddd0b1b/800/600",
    teamSize: 4,
    tagIds: [tags[9].id, tags[1].id, tags[4].id], // Sustentabilidade, Web, Dados
  },
];
