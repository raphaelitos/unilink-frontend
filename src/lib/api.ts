import axios from "axios";
import type { Center, Tag, CreateProjectRequest, ProjectResponse } from "@/types/project";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
});

export async function getCenters(): Promise<Center[]> {
  const { data } = await api.get<Center[]>("/api/centers");
  // garante array (alguns backends mandam objeto único no exemplo)
  return Array.isArray(data) ? data : [data as unknown as Center];
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>("/api/tags");
  return Array.isArray(data) ? data : [data as unknown as Tag];
}

export async function createProject(payload: CreateProjectRequest): Promise<ProjectResponse> {
  const { data } = await api.post<ProjectResponse>("/api/projects", payload);
  return data;
}
