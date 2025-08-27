import type { ApiCenter, ApiTag, ApiProjectDetailed } from "@/types/project";
import { centers as rawCenters, tags as rawTags, projects as rawProjects } from "@/lib/mock";

export const apiCenters: ApiCenter[] = rawCenters.map(c => ({ ...c }));
export const apiTags: ApiTag[] = rawTags.map(t => ({ ...t }));

const centerMap = Object.fromEntries(apiCenters.map(c => [c.id, c]));
const tagMap = Object.fromEntries(apiTags.map(t => [t.id, t]));

export const apiProjects: ApiProjectDetailed[] = rawProjects.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  openForApplications: p.openForApplications,
  imgUrl: p.imgUrl,
  teamSize: p.teamSize,
  owner: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", name: "Owner Mock", email: "owner@mock" },
  center: centerMap[p.centerId],
  tags: p.tagIds.map(id => tagMap[id]).filter(Boolean),
}));
