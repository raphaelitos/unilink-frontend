// /src/pages/api/projects/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { type AxiosResponse } from "axios";
import { AUTH_COOKIE_NAME } from "@/lib/api";
import type { ProjectQueryFilter, ApiProjectDetailed } from "@/types/project";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://unilink-backend-production.up.railway.app";

type BackendOk = ApiProjectDetailed[];
type BackendErr = { message?: string; error?: string; status?: number } | string | null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    const filter = (req.body ?? {}) as ProjectQueryFilter;

    // Node adapter permite GET com body (igual Postman)
    const resp: AxiosResponse<BackendOk | BackendErr> = await axios.request({
      method: "GET",
      url: `${BACKEND_BASE_URL}/api/projects`,
      data: filter,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      validateStatus: () => true, // não lançar em 4xx/5xx
    });

    // Sucesso
    if (resp.status >= 200 && resp.status < 300) {
      const payload = Array.isArray(resp.data) ? resp.data : [];
      return res.status(200).json(payload);
    }

    // Erro vindo do backend — propaga status e normaliza payload
    const status = resp.status || 500;
    const payload =
      typeof resp.data === "object" && resp.data !== null
        ? resp.data
        : { message: "Erro ao buscar projetos" };

    return res.status(status).json(payload);
  } catch (err: unknown) {
    // Axios error?
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const data = err.response?.data;
      const payload =
        typeof data === "object" && data !== null
          ? data
          : { message: err.message || "Proxy error" };
      return res.status(status).json(payload);
    }

    // Erro não-Axios
    const message = err instanceof Error ? err.message : "Proxy error";
    return res.status(500).json({ message });
  }
}
