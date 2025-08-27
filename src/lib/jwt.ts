/**
 * Utilidades para lidar com JWT no cliente.
 * - parseJwt: decodifica a payload (base64url) em objeto.
 * - getUserIdFromPayload: extrai o id do usuário (prioriza `sub`, fallback `id`).
 * - getCurrentUserIdFromCookie: lê o cookie AUTH_COOKIE_NAME e retorna o id do usuário atual.
 */

import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/api";

export interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
}

/** Decodifica base64url para string. Retorna '' se falhar. */
function base64UrlDecode(input: string): string {
  try {
    // base64url -> base64
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
    // padding
    const pad = b64.length % 4 === 2 ? "==" : b64.length % 4 === 3 ? "=" : "";
    const normalized = b64 + pad;

    // atob pode não existir no SSR; só use no client
    if (typeof window === "undefined" || typeof atob !== "function") return "";

    const bin = atob(normalized);

    // trata unicode de forma segura
    const percentEncoded = Array.prototype
      .map
      .call(bin, (c: string) => {
        const code = c.charCodeAt(0).toString(16).padStart(2, "0");
        return `%${code}`;
      })
      .join("");

    return decodeURIComponent(percentEncoded);
  } catch {
    return "";
  }
}

/** Decodifica o token JWT e retorna a payload como objeto. */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadStr = base64UrlDecode(parts[1]);
    if (!payloadStr) return null;
    const json = JSON.parse(payloadStr);
    return json && typeof json === "object" ? (json as JwtPayload) : null;
  } catch {
    return null;
  }
}

/** Retorna o id do usuário com prioridade para `sub`, fallback `id`. */
export function getUserIdFromPayload(p: JwtPayload | null): string | null {
  if (!p) return null;
  return (p.sub as string) ?? (p.id as string) ?? null;
}

/** Lê o cookie AUTH_COOKIE_NAME e retorna o id do usuário atual (ou null). */
export function getCurrentUserIdFromCookie(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const token = Cookies.get(AUTH_COOKIE_NAME);
    if (!token) return null;
    const payload = parseJwt(token);
    return getUserIdFromPayload(payload);
  } catch {
    return null;
  }
}
