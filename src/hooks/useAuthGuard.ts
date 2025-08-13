import * as React from "react";
import { useRouter } from "next/router";
import { getToken } from "@/lib/auth";

/**
 * Redireciona para /login se não houver JWT no cookie.
 * Uso: useAuthGuard(true) em páginas protegidas no client.
 */
export function useAuthGuard(shouldProtect: boolean) {
  const router = useRouter();

  React.useEffect(() => {
    if (!shouldProtect) return;
    const token = getToken();
    if (!token && typeof window !== "undefined" && window.location.pathname !== "/login") {
      // Evita loop se já estiver no login
      router.replace("/login");
    }
  }, [router, shouldProtect]);
}
