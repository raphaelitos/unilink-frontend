import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";
import Cookies from "js-cookie";
import type {
  Center,
  Tag,
  CreateProjectRequest,
  ProjectResponse,
} from "@/types/project";

const AUTH_COOKIE = "auth-token";

/**
 * Cria uma instância do Axios com interceptors:
 * - Request: injeta Authorization: Bearer <token> a partir do cookie
 * - Response: em 401 remove o cookie e opcionalmente redireciona para /login (somente client)
 */
export function createApi(): AxiosInstance {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8080";

  const instance = axios.create({
    baseURL,
    withCredentials: false,
  });

  // Request: injeta Authorization se houver token
  instance.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_COOKIE);
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers ??
        {}) as AxiosRequestHeaders;
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
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Singleton para uso na aplicação
export const api = createApi();

// Exporta o nome do cookie para outros módulos (auth.ts)
export const AUTH_COOKIE_NAME = AUTH_COOKIE;

/*
 *  API pública (sem token)
 * */

export async function getCenters(): Promise<Center[]> {
  const { data } = await api.get<Center[] | Center>("/api/centers");
  return Array.isArray(data) ? data : [data as Center];
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[] | Tag>("/api/tags");
  return Array.isArray(data) ? data : [data as Tag];
}

/*
 *  Projects (create/read/update)
 * */

export async function createProject(
  payload: CreateProjectRequest
): Promise<ProjectResponse> {
  const { data } = await api.post<ProjectResponse>("/api/projects", payload);
  return data;
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  const { data } = await api.get<ProjectResponse>(`/api/projects/${id}`);
  return data;
}

export async function updateProject(
  id: string,
  body: CreateProjectRequest
): Promise<ProjectResponse> {
  const { data } = await api.put<ProjectResponse>(`/api/projects/${id}`, body);
  return data;
}

export type ProjectUpdateRequest = CreateProjectRequest;
