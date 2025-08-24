export type UUID = string;

export type Center = { id: UUID; name: string; centerUrl: string };
export type Tag = { id: UUID; name: string; colorHex: string };

export type ProjectResponse = {
  id: UUID;
  name: string;
  description: string;
  centerId: UUID;
  ownerId: UUID;
  openForApplications: boolean;
  imgUrl: string;
  teamSize: number;
  tagIds?: UUID[];
};

export type CreateProjectRequest = {
  name: string;
  description: string;
  centerId: UUID;
  ownerId: UUID;
  openForApplications: boolean;
  imgUrl: string;
  teamSize: number;
  tagsToBeAdded: UUID[];
  tagsToBeRemoved: UUID[];
  validForCreation: boolean;
};

export type ApiCenter = { id: string; name: string; centerUrl: string };
export type ApiTag = { id: string; name: string; colorHex: string };
export type ApiUser = { id: string; name: string; email: string };

export type ApiProjectDetailed = {
  id: string;
  name: string;
  description: string;
  openForApplications: boolean;
  imgUrl: string | null;
  teamSize: number;
  owner: ApiUser | null;
  center: ApiCenter | null;
  tags: ApiTag[];
};

export type ProjectEditRequest = {
  name: string;
  description: string;
  centerId: string;        // uuid
  ownerId: string;         // uuid
  openForApplications: boolean;
  imgUrl: string;          // pode ser vazio quando imageBase64 for usado
  teamSize: number;
  tagsToBeAdded: string[];   // uuids
  tagsToBeRemoved: string[]; // uuids
  imageBase64?: string;      // opcional
  imageContentType?: string; // opcional; obrigatório se imageBase64 existir
  validForCreation: boolean; // manter true conforme backend
};
