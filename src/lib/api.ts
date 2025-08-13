import axios from "axios";
import type {
  Center,
  Tag,
  CreateProjectRequest,
  ProjectResponse,
} from "@/types/project";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
});

export async function getCenters(): Promise<Center[]> {
  const { data } = await api.get<Center[] | Center>("/api/centers");
  return Array.isArray(data) ? data : [data as Center];
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[] | Tag>("/api/tags");
  return Array.isArray(data) ? data : [data as Tag];
}

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
