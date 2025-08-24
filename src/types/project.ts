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

export type ApiCenter = { id: UUID; name: string; centerUrl: string };
export type ApiTag = { id: UUID; name: string; colorHex: string };
export type ApiUser = { id: UUID; name: string; email: string };

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

export type ProjectEditRequest = {
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
