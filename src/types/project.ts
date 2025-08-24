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

/* Fica ai para possivel implementacao de zod
import { z } from "zod";

export const apiProjectDetailedSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  openForApplications: z.boolean().optional(),
  imgUrl: z.string().url().nullable().optional(),
  teamSize: z.number().int().nonnegative().optional(),
  owner: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
  center: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      centerUrl: z.string().url().optional(),
    })
    .nullable()
    .optional(),
  tags: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        colorHex: z.string(),
      })
    )
    .optional(),
});
*/
