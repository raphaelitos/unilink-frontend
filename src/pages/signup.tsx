import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createUser } from "@/lib/users";
import { login } from "@/lib/auth";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

type BackendError = { message?: string; error?: string };

export default function SignUp() {
  const router = useRouter();

  const [generalError, setGeneralError] = React.useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setGeneralError(undefined);

    // monta payload conforme contrato
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: "PROJECT_ADMIN" as const,
      validForCreation: true as const,
    };

    try {
      // 1) cria usuário
      await createUser(payload);

      // 2B) Auto-login (padrão)
      await login(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          role: "PROJECT_ADMIN",
          validForCreation: true,
        },
        true // useExtendedBody
      );
      reset({ name: "", email: "", password: "", confirmPassword: "" });
      router.push("/login");

    } catch (error: unknown) {
      let message =
        "Falha ao criar conta. Verifique os dados e tente novamente.";

      if (error instanceof AxiosError) {
        const data = error.response?.data as BackendError | undefined;
        message = data?.message || data?.error || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      setGeneralError(message);

      if (!errors.email) setError("email", { type: "server" });
      if (!errors.password) setError("password", { type: "server" });
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro • UniLink</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {/* Mantém estética original */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
            <p className="text-gray-600">Cadastre-se para começar com sua conta</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {generalError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600" role="alert">
                    {generalError}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                  className={`${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="Seu nome aqui"
                />
                {errors.name && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  className={`${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="Enter your email"
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
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={`${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="Crie uma senha"
                />
                {errors.password && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900">
                  Confirme a Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                  className={`${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  }`}
                  placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Faça login
              </Link>
            </p>
            <Link href="/" className="text-primary hover:text-primary/80 text-sm">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
