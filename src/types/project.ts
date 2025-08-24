export type UUID = string;

/** Schemas de leitura (responses) */
export type ApiCenter = {
  id: UUID;
  name: string;
  centerUrl: string;
};

export type ApiTag = {
  id: UUID;
  name: string;
  colorHex: string;
};

export type ApiUser = {
  id: UUID;
  name: string;
  email: string;
};

/** Project detalhado */
export type ApiProjectDetailed = {
  id: UUID;
  name: string;
  description: string;
  openForApplications: boolean;
  imgUrl: string | null;
  teamSize: number;
  owner: ApiUser | null;
  center: ApiCenter | null;
  tags: ApiTag[];
};

/** ProjectRequestDTO (create/update) */
export type ProjectRequestDTO = {
  name: string;
  description: string;
  centerId: UUID;
  ownerId: UUID;
  openForApplications: boolean;
  imgUrl: string;
  teamSize: number;
  tagsToBeAdded: UUID[];
  tagsToBeRemoved: UUID[];
  imageBase64?: string;
  imageContentType?: string;
  validForCreation: boolean;
};

export type CreateProjectRequest = ProjectRequestDTO;
export type UpdateProjectRequest = ProjectRequestDTO;

export type ProjectQueryFilter = {
  name?: string;
  teamSizeGTE?: number;
  teamSizeLTE?: number;
  centerId?: UUID;
  openForApplications?: boolean;
  tagIds?: UUID[];
};

/** Respostas utilitárias */
export type GetProjectsResponse = ApiProjectDetailed[];
