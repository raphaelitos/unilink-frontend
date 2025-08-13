import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from "@/components/Header";
import { TagsMultiSelect } from "@/components/form/TagsMultiSelect";

import { getCenters, getTags, createProject } from "@/lib/api";
import type { Center, Tag, UUID, CreateProjectRequest } from "@/types/project";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/components/ui/utils"; // se não existir, troque por uma função util local

// -----------------------------
// Zod schema
// -----------------------------
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const Schema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
  description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres."),
  centerId: z.string().regex(uuidRegex, "Selecione um centro válido."),
  ownerId: z.string().regex(uuidRegex, "Informe um UUID válido para o responsável."),
  openForApplications: z.boolean().default(false),
  imgUrl: z.string().url("Forneça uma URL de imagem válida."),
  teamSize: z.coerce.number().int().min(1, "Tamanho mínimo da equipe é 1."),
  tagsToBeAdded: z.array(z.string().regex(uuidRegex)).default([]),
  tagsToBeRemoved: z.array(z.string().regex(uuidRegex)).default([]),
  validForCreation: z.literal(true),
});

type FormValues = z.infer<typeof Schema>;

export default function CadastrarProjetoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [centers, setCenters] = React.useState<Center[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loadingCenters, setLoadingCenters] = React.useState(true);
  const [loadingTags, setLoadingTags] = React.useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      description: "",
      centerId: "",
      ownerId: "",
      openForApplications: false,
      imgUrl: "",
      teamSize: 1,
      tagsToBeAdded: [],
      tagsToBeRemoved: [],
      validForCreation: true,
    },
    mode: "onBlur",
  });

  const imgUrl = watch("imgUrl");
  const selectedTags = watch("tagsToBeAdded");
  const removedTags = watch("tagsToBeRemoved");

  // Fetch centers
  const fetchCenters = React.useCallback(async () => {
    try {
      setLoadingCenters(true);
      const data = await getCenters();
      setCenters(data);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar centros",
        description: e?.message ?? "Tente novamente.",
      });
    } finally {
      setLoadingCenters(false);
    }
  }, [toast]);

  // Fetch tags
  const fetchTags = React.useCallback(async () => {
    try {
      setLoadingTags(true);
      const data = await getTags();
      setTags(data);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar tags",
        description: e?.message ?? "Tente novamente.",
      });
    } finally {
      setLoadingTags(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCenters();
    fetchTags();
  }, [fetchCenters, fetchTags]);

  const onSubmit = async (values: FormValues) => {
    const payload: CreateProjectRequest = {
      name: values.name,
      description: values.description,
      centerId: values.centerId as UUID,
      ownerId: values.ownerId as UUID,
      openForApplications: values.openForApplications,
      imgUrl: values.imgUrl,
      teamSize: values.teamSize,
      tagsToBeAdded: values.tagsToBeAdded,
      tagsToBeRemoved: values.tagsToBeRemoved,
      validForCreation: true,
    };

    try {
      const created = await createProject(payload);
      toast({
        title: "Projeto criado com sucesso!",
      });
      // redirect
      router.push(`/projects/${created.id}`);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar projeto",
        description: e?.response?.data?.message ?? e?.message ?? "Verifique os campos e tente novamente.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Cadastrar projeto • UniLink</title>
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8">
          Cadastrar projeto
        </h1>

        {/* Grid principal */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 lg:gap-10">
          {/* Coluna esquerda – preview + input de imagem */}
          <section aria-labelledby="preview-title">
            <h2 id="preview-title" className="sr-only">
              Preview da imagem
            </h2>
            <Card className="bg-card rounded-3xl shadow-sm">
              <CardContent className="p-4">
                <div className="relative bg-muted rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt="Preview da imagem do projeto"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Aguardando URL da imagem…
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="imgUrl" className="text-sm text-muted-foreground">
                    URL da imagem do projeto
                  </Label>
                  <Input
                    id="imgUrl"
                    placeholder="https://exemplo.com/imagem.jpg"
                    aria-invalid={!!errors.imgUrl}
                    {...register("imgUrl")}
                  />
                  {errors.imgUrl && (
                    <p className="text-sm text-destructive">{errors.imgUrl.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Coluna direita – campos do formulário */}
          <section aria-labelledby="form-title" className="space-y-6">
            <h2 id="form-title" className="sr-only">
              Informações do projeto
            </h2>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Nome do projeto
              </Label>
              <Input
                id="name"
                placeholder="Ex.: Sistema de Gestão Escolar"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-muted-foreground">
                Adicione uma descrição
              </Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Descreva o objetivo, escopo e resultados esperados…"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Centro (SELECT) – abaixo da descrição */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Selecione o departamento envolvido</Label>
              {loadingCenters ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  onValueChange={(val) => setValue("centerId", val, { shouldValidate: true })}
                  value={watch("centerId")}
                  disabled={loadingCenters}
                >
                  <SelectTrigger className="w-full justify-between" aria-invalid={!!errors.centerId}>
                    <SelectValue placeholder="Escolha um centro…" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.centerId && (
                <p className="text-sm text-destructive">{errors.centerId.message}</p>
              )}
              {!loadingCenters && centers.length === 0 && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Nenhum centro encontrado.</p>
                  <Button type="button" variant="secondary" size="sm" onClick={fetchCenters}>
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>

            {/* Tags a adicionar – abaixo do SELECT de centro */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Selecione as tags do projeto</Label>
              {loadingTags ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <TagsMultiSelect
                  options={tags}
                  value={selectedTags}
                  onChange={(vals) => setValue("tagsToBeAdded", vals, { shouldValidate: true })}
                  placeholder="Escolha tags…"
                />
              )}
              {!loadingTags && tags.length === 0 && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Nenhuma tag disponível.</p>
                  <Button type="button" variant="secondary" size="sm" onClick={fetchTags}>
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>

            {/* Tags a remover – abaixo do multi-select anterior */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Remover tags (opcional)</Label>
              {loadingTags ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <TagsMultiSelect
                  options={tags}
                  value={removedTags}
                  onChange={(vals) => setValue("tagsToBeRemoved", vals)}
                  placeholder="Selecione tags para remover…"
                />
              )}
            </div>

            {/* Owner */}
            <div className="space-y-2">
              <Label htmlFor="ownerId" className="text-sm text-muted-foreground">
                Responsável (ownerId)
              </Label>
              <Input
                id="ownerId"
                placeholder="UUID do responsável"
                aria-invalid={!!errors.ownerId}
                {...register("ownerId")}
              />
              {errors.ownerId && (
                <p className="text-sm text-destructive">{errors.ownerId.message}</p>
              )}
            </div>

            {/* Tamanho da equipe */}
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-sm text-muted-foreground">
                Tamanho da equipe
              </Label>
              <Input
                id="teamSize"
                type="number"
                min={1}
                aria-invalid={!!errors.teamSize}
                {...register("teamSize", { valueAsNumber: true })}
              />
              {errors.teamSize && (
                <p className="text-sm text-destructive">{errors.teamSize.message}</p>
              )}
            </div>

            {/* Inscrições abertas */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="openForApplications"
                checked={watch("openForApplications")}
                onCheckedChange={(v) => setValue("openForApplications", Boolean(v))}
                aria-label="Inscrições abertas"
              />
              <Label htmlFor="openForApplications">Inscrições abertas</Label>
            </div>

            <Separator />

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="min-w-44"
                disabled={isSubmitting || loadingCenters || loadingTags}
              >
                {isSubmitting ? "Salvando..." : "Save changes"}
              </Button>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}
