import { api } from "@/lib/api";
import type { CreateUserRequest, UserResponse } from "@/types/user";

/**
 * Cria um usuário no backend.
 * Regras: role = "PROJECT_ADMIN", validForCreation = true (já devem vir no payload).
 */
export async function createUser(payload: CreateUserRequest): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>("/api/users", payload);
  return data;
}
