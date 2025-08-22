import axios, { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = (error as AxiosError<{ message?: string }>).response?.data;
    return (data?.message as string) ?? error.message ?? "Erro inesperado.";
  }
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return "Erro desconhecido.";
  }
}
