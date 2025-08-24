import { api } from "@/lib/api";
import type { ApiProjectDetailed, ProjectEditRequest } from "@/types/project";

/** GET /api/projects/{id} — endpoint público */
export async function getProjectById(id: string): Promise<ApiProjectDetailed> {
  const { data } = await api.get<ApiProjectDetailed>(`/api/projects/${id}`);
  return data;
}

/** PUT /api/projects/{id} — atualiza projeto com ProjectRequestDTO */
export async function updateProject(
  id: string,
  payload: ProjectEditRequest
): Promise<ApiProjectDetailed> {
  const { data } = await api.put<ApiProjectDetailed>(`/api/projects/${id}`, payload);
  return data;
}
