import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";
import Cookies from "js-cookie";
import type {
  ApiCenter as Center,
  ApiTag as Tag,
  CreateProjectRequest,
  ApiProjectDetailed as ProjectResponse,
} from "@/types/project";
import type { ApiUser, UUID } from "@/types/project";

const AUTH_COOKIE = "auth-token";

/**
 * Cria uma instância do Axios com interceptors:
 * - Request: injeta Authorization: Bearer <token> a partir do cookie
 * - Response: em 401 remove o cookie e (no client) redireciona para /login
 */
export function createApi(): AxiosInstance {  
  const baseURL = "https://unilink-backend-production.up.railway.app";
  // const baseURL = "http://localhost:8080";

  const instance = axios.create({
    baseURL,
    withCredentials: false,
  });

  // Request: injeta Authorization se houver token
  instance.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_COOKIE);
    if (token) {
      const headers: AxiosRequestHeaders =
        (config.headers as AxiosRequestHeaders) ?? ({} as AxiosRequestHeaders);
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    return config;
  });

  // Response: em 401, limpa cookie e (se no client) redireciona
  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        Cookies.remove(AUTH_COOKIE, { path: "/" });
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Singleton
export const api = createApi();

// Exporta o nome do cookie para outros módulos
export const AUTH_COOKIE_NAME = AUTH_COOKIE;

/* =========================================================
 *  Endpoints públicos (sem token): centers e tags
 * =======================================================*/

export async function getCenters(): Promise<Center[]> {
  const { data } = await api.get<Center[]>("/api/centers");
  return data;
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>("/api/tags");
  return data;
}

/* =========================================================
 *  Projects (create)
 * =======================================================*/

export async function createProject(
  payload: CreateProjectRequest
): Promise<ProjectResponse> {
  // Mantido ProjectResponse aqui para compat com telas existentes (ex.: cadastro),
  // que usam apenas o "id" para redirecionar. Se quiser alinhar ao OpenAPI (Project detalhado),
  // ajuste o tipo de retorno para ApiProjectDetailed.
  const { data } = await api.post<ProjectResponse>("/api/projects", payload);
  return data;
}


export async function getUserById(id: UUID): Promise<ApiUser> {
  const { data } = await api.get<ApiUser>(`/api/users/${id}`);
  return data;
}
