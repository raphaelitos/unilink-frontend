export type UUID = string;

export type Center = {
  id: UUID;
  name: string;
  centerUrl: string;
};

export type Tag = {
  id: UUID;
  name: string;
  colorHex: string; // usado para o fundo do chip/badge da tag
};

export type Project = {
  id: UUID;
  name: string;
  description: string;
  centerId: UUID;
  ownerId: UUID;
  openForApplications: boolean;
  imgUrl: string;
  teamSize: number;
  tagIds: UUID[]; // relação com Tag
};
