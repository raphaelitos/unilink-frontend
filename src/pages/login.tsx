import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from 'next/link'

import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth";
import type { LoginBodyExtended } from "@/types/auth";

// Validação dos campos do formulário
const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const payload: LoginBodyExtended = {
        name: "-",
        role: "PROJECT_ADMIN",
        validForCreation: true,
        email: values.email,
        password: values.password,
      };

      await login(payload, true /* useExtendedBody */);

      toast({ title: "Login realizado!" });
      router.push("/");
    } catch (error: unknown) {
      let message: string;

      if (error instanceof AxiosError) {
        // Erro vindo do Axios
        message =
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          "Não foi possível autenticar. Verifique suas credenciais.";
      } else if (error instanceof Error) {
        // Erro genérico
        message = error.message;
      } else {
        message = "Não foi possível autenticar. Verifique suas credenciais.";
      }

      setError("email", { type: "server", message: undefined });
      setError("password", { type: "server", message: undefined });

      toast({
        variant: "destructive",
        title: "Erro no login",
        description: message,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login • UniLink</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
            <p className="text-gray-600">Entre com suas credenciais para acessar sua conta</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {/* Mensagem de erro global (via toast) */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className={`${errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary"
                    }`}
                  placeholder="seuNome@dominio.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={`${errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary"
                    }`}
                  placeholder="suaSenha123"
                />
                {errors.password && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-500 mt-4">
                Novo aqui?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Crie uma conta
                </Link>{' '}
              </p>
            </div>
            

          </div>

          <div className="text-center">
            <Link href="/" className="text-primary hover:text-primary/80 text-sm">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Testes manuais:
 * - Válido: credenciais corretas -> token salvo em cookie, redireciona /feed
 * - Inválido: 4xx -> toast de erro; não cria cookie
 * - Expirado: qualquer rota 401 -> interceptor remove cookie e navega pra /login
 */
