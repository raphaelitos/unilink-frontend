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
