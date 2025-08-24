import { api } from "@/lib/api";
import type { ApiProjectDetailed } from "@/types/project";

/**
 * Busca um projeto detalhado pelo ID.
 * Endpoint público: GET /api/projects/{id}
 */
export async function getProjectById(id: string): Promise<ApiProjectDetailed> {
  const { data } = await api.get<ApiProjectDetailed>(`/api/projects/${id}`);
  return data;
}
