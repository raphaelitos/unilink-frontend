import { api } from '@/lib/api';
import type {
  ApiProjectDetailed,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectQueryFilter,
  GetProjectsResponse,
  UUID,
} from '@/types/project';

/**
 * GET /api/projects/{id}
 * Retorna um projeto detalhado (owner, center, tags).
 * Endpoint público; se houver cookie, Authorization será enviado pelos interceptors.
 */
export async function getProjectById(id: UUID): Promise<ApiProjectDetailed> {
  const { data } = await api.get<ApiProjectDetailed>(`/api/projects/${id}`);
  return data;
}

/**
 * GET /api/projects  (com body ProjectQueryFilter — conforme OpenAPI)
 * Observação: alguns proxies/clients não suportam body em GET.
 * O backend declarou esse contrato; usamos axios.request para enviar "data" no GET.
 * Se sua infra recusar GET com body, considere evoluir para POST /api/projects/search (futuro).
 */
export async function getProjects(filter?: ProjectQueryFilter): Promise<GetProjectsResponse> {
  const { data } = await api.request<GetProjectsResponse>({
    method: 'GET',
    url: '/api/projects',
    // axios permite 'data' em GET; o servidor precisa aceitar
    ...(filter ? { data: filter } : {}),
  });
  return data;
}

/**
 * POST /api/projects
 * Cria um projeto. Alinhado ao ProjectRequestDTO do OpenAPI.
 * IMAGEM: se enviar imageBase64, envie também imageContentType (ex: "image/jpeg").
 * imgUrl pode ser string vazia quando imageBase64 for usado (UI decide).
 */
export async function createProject(payload: CreateProjectRequest): Promise<ApiProjectDetailed> {
  if (payload.imageBase64 && !payload.imageContentType) {
    //possivel fonte de erro; no momento to deixando o backend validar.
  }
  const { data } = await api.post<ApiProjectDetailed>('/api/projects', payload);
  return data;
}

/**
 * PUT /api/projects/{id}
 * Atualiza um projeto. Mesmo payload do create (ProjectRequestDTO).
 * IMAGEM: segue as mesmas regras do create.
 */
export async function updateProject(id: UUID, payload: UpdateProjectRequest): Promise<ApiProjectDetailed> {
  if (payload.imageBase64 && !payload.imageContentType) {
    // mais uma possivel fonte de erro
    // console.warn('imageContentType é recomendado quando imageBase64 é enviado.');
  }
  const { data } = await api.put<ApiProjectDetailed>(`/api/projects/${id}`, payload);
  return data;
}

/**
 * DELETE /api/projects/{id}
 * Remove um projeto (seu backend expõe o endpoint).
 */
export async function deleteProject(id: UUID): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}