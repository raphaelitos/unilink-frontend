import Cookies from "js-cookie";
import { api, AUTH_COOKIE_NAME } from "@/lib/api";
import type { LoginBodyBase, LoginBodyExtended, LoginResponse } from "@/types/auth";

/**
 * Faz login na API e persiste o JWT no cookie `auth-token`.
 * @param body payload de login (base ou estendido)
 * @param useExtendedBody quando true (default), envia o body estendido exigido atualmente pelo backend
 */
export async function login(
  body: LoginBodyBase | LoginBodyExtended,
  useExtendedBody = true
): Promise<LoginResponse> {
  const payload = useExtendedBody
    ? (body as LoginBodyExtended)
    : ({ email: (body as LoginBodyBase).email, password: (body as LoginBodyBase).password });

  const { data } = await api.post<LoginResponse>("/api/auth/login", payload);

  // Salva o token por ~3h (0.125 dias)
  Cookies.set(AUTH_COOKIE_NAME, data.token, {
    expires: 0.125,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return data;
}

export function logout(redirect = true) {
  Cookies.remove(AUTH_COOKIE_NAME, { path: "/" });
  if (redirect && typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function getToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
