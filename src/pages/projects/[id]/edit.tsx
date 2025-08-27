import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";
import { AxiosError } from "axios";

import { Header } from "@/components/Header";
import { TagsMultiSelect } from "@/components/form/TagsMultiSelect";

import { getCenters, getTags } from "@/lib/api";
import { getProjectById, updateProject } from "@/lib/projects";
import type {
  ApiCenter as Center,
  ApiTag as Tag,
  ApiProjectDetailed,
  UpdateProjectRequest as ProjectEditRequest,
} from "@/types/project";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectEditSkeleton } from "@/components/Skeletons";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { isAcceptedImage, buildImagePayload } from "@/lib/images";
import { diffTagIds, dedupeUUIDs, ensureArrays } from "@/lib/tags";

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const Schema = z
  .object({
    name: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
    description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres."),
    centerId: z.string().regex(uuidRegex, "Selecione um centro válido."),
    ownerId: z.string().regex(uuidRegex, "Informe um UUID válido para o responsável."),
    openForApplications: z.boolean(),
    imgUrl: z.string().url("Forneça uma URL de imagem válida.").or(z.literal("")),
    teamSize: z.number().int().min(1, "Tamanho mínimo da equipe é 1."),
    // Este campo representa as TAGS SELECIONADAS atualmente (não o delta)
    tagsToBeAdded: z.array(z.string().regex(uuidRegex, "UUID inválido")),
    // Mantemos no form para compat visual, mas será ignorado no submit
    tagsToBeRemoved: z.array(z.string().regex(uuidRegex, "UUID inválido")),
    imageBase64: z.string().optional(),
    imageContentType: z.string().optional(),
    validForCreation: z.literal(true),
  })
  .refine(
    (v) => {
      if (v.imageBase64 && !v.imageContentType) return false;
      return true;
    },
    {
      path: ["imageContentType"],
      message: "Obrigatório quando uma imagem em Base64 for enviada.",
    }
  );

type FormValues = z.infer<typeof Schema>;

const defaultValues: DefaultValues<FormValues> = {
  name: "",
  description: "",
  centerId: "",
  ownerId: "",
  openForApplications: false,
  imgUrl: "",
  teamSize: 1,
  tagsToBeAdded: [],
  tagsToBeRemoved: [],
  imageBase64: undefined,
  imageContentType: undefined,
  validForCreation: true,
};

export default function EditProjectPage() {
  useAuthGuard(true); // Protege a rota

  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { toast } = useToast();

  const [centers, setCenters] = React.useState<Center[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loadingCenters, setLoadingCenters] = React.useState(true);
  const [loadingTags, setLoadingTags] = React.useState(true);
  const [loadingProject, setLoadingProject] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Guarda as tags originais para calcular delta no submit
  const originalTagIdsRef = React.useRef<string[]>([]);

  // Preview local (DataURL). Render final SEMPRE por imgUrl.
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues,
    mode: "onBlur",
    shouldFocusError: true,
  });

  const imgUrl = watch("imgUrl");
  const selectedTags = watch("tagsToBeAdded");
  const removedTags = watch("tagsToBeRemoved");

  // Carregar centers e tags (públicos)
  const fetchCenters = React.useCallback(async () => {
    try {
      setLoadingCenters(true);
      setCenters(await getCenters());
    } catch {
      setErrorMessage("Erro ao carregar centros");
    } finally {
      setLoadingCenters(false);
    }
  }, []);

  const fetchTags = React.useCallback(async () => {
    try {
      setLoadingTags(true);
      setTags(await getTags());
    } catch {
      setErrorMessage("Erro ao carregar tags");
    } finally {
      setLoadingTags(false);
    }
  }, []);

  // Hidrata o form com o projeto
  const hydrateFormFromProject = React.useCallback(
    (p: ApiProjectDetailed) => {
      const original = (p.tags ?? []).map((t) => t.id);
      originalTagIdsRef.current = original;

      reset({
        name: p.name,
        description: p.description,
        centerId: p.center?.id ?? "",
        ownerId: p.owner?.id ?? "",
        openForApplications: p.openForApplications,
        imgUrl: p.imgUrl ?? "",
        teamSize: p.teamSize,
        // No form, guardamos as TAGS SELECIONADAS atuais
        tagsToBeAdded: original,
        // Campo visual/compat: manter vazio
        tagsToBeRemoved: [],
        imageBase64: undefined,
        imageContentType: undefined,
        validForCreation: true,
      });
      setLocalPreviewUrl(null);
    },
    [reset]
  );

  // Carrega o projeto
  const fetchProject = React.useCallback(
    async (projectId: string) => {
      setLoadingProject(true);
      setErrorMessage(null);
      setNotFound(false);
      try {
        const p = await getProjectById(projectId);
        hydrateFormFromProject(p);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setNotFound(true);
        } else {
          const msg =
            (error as AxiosError)?.response?.data &&
            ((error as AxiosError).response?.data as { message?: string; error?: string }).message
              ? ((error as AxiosError).response!.data as { message?: string }).message!
              : (error as Error)?.message ?? "Erro ao carregar projeto";
          setErrorMessage(msg);
        }
      } finally {
        setLoadingProject(false);
      }
    },
    [hydrateFormFromProject]
  );

  // Efeito inicial: valida UUID e busca em paralelo
  React.useEffect(() => {
    if (!id) return;
    if (!uuidRegex.test(id)) {
      setNotFound(true);
      setLoadingProject(false);
      return;
    }
    void Promise.all([fetchProject(id), fetchCenters(), fetchTags()]);
  }, [id, fetchProject, fetchCenters, fetchTags]);

  // Escolha de arquivo: valida, converte e injeta base64+mimetype no form (preview só local)
  const onFileChosen: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAcceptedImage(file)) {
      toast({
        variant: "destructive",
        title: "Imagem inválida",
        description: "Envie uma imagem (até 5MB).",
      });
      return;
    }

    const { imageBase64, imageContentType, dataURL } = await buildImagePayload(file);
    setLocalPreviewUrl(dataURL);
    setValue("imageBase64", imageBase64, { shouldValidate: true });
    setValue("imageContentType", imageContentType, { shouldValidate: true });
    setValue("imgUrl", "", { shouldValidate: false });
    toast({ title: "Pré-visualização aplicada", description: "A imagem será enviada ao salvar." });
  };

  // Submit
  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    // 🔁 Calcula delta: selected (form) vs original (carregado)
    const selected = dedupeUUIDs(ensureArrays(values.tagsToBeAdded));
    const original = dedupeUUIDs(ensureArrays(originalTagIdsRef.current));
    const { toAdd, toRemove } = diffTagIds(original, selected);

    const payload: ProjectEditRequest = {
      name: values.name,
      description: values.description,
      centerId: values.centerId,
      ownerId: values.ownerId,
      openForApplications: values.openForApplications,
      imgUrl: values.imgUrl,
      teamSize: values.teamSize,
      // ✅ Envia apenas o delta; arrays sempre presentes
      tagsToBeAdded: toAdd,
      tagsToBeRemoved: toRemove,
      imageBase64: values.imageBase64 || undefined,
      imageContentType: values.imageContentType || undefined,
      validForCreation: true,
    };

    try {
      await updateProject(id, payload);
      toast({ title: "Projeto atualizado com sucesso!" });
      setLocalPreviewUrl(null);
      router.push(`/projects/${id}`);
    } catch (error) {
      const message =
        (error as AxiosError)?.response?.data &&
        ((error as AxiosError).response?.data as { message?: string; error?: string }).message
          ? ((error as AxiosError).response!.data as { message?: string }).message!
          : (error as Error)?.message ?? "Falha ao salvar projeto";
      toast({
        variant: "destructive",
        title: "Erro ao salvar projeto",
        description: message,
      });
    }
  };

  const isLoadingAny = loadingProject || loadingCenters || loadingTags;

  // 404
  if (!isLoadingAny && notFound) {
    return (
      <>
        <Head>
          <title>Editar projeto • UniLink</title>
        </Head>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-center">
            Projeto não encontrado
          </h1>
          <p className="text-center text-muted-foreground mt-3">
            O projeto solicitado não existe ou foi removido.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/" className="text-primary hover:text-primary/80 text-sm">
              ← Voltar
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Editar projeto • UniLink</title>
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8">Editar projeto</h1>

        {isLoadingAny && <ProjectEditSkeleton />}

        {!isLoadingAny && errorMessage && (
          <div className="mb-6 text-center">
            <p className="text-sm text-destructive">{errorMessage}</p>
            <button
              type="button"
              onClick={() => id && Promise.all([fetchProject(id), fetchCenters(), fetchTags()])}
              className="mt-2 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 lg:gap-10">
          {/* Coluna esquerda — preview / imagem */}
          <section aria-labelledby="preview-title">
            <h2 id="preview-title" className="sr-only">
              Pré-visualização da imagem
            </h2>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4">
                <div className="relative bg-muted rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
                  {isLoadingAny ? (
                    <Skeleton className="w-full h-full" />
                  ) : localPreviewUrl || imgUrl ? (
                    <Image
                      src={localPreviewUrl || imgUrl}
                      alt="Imagem do projeto"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem imagem</span>
                  )}
                </div>

                <TooltipProvider>
                  <div className="mt-4 flex justify-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          aria-label="Carregar nova foto (apenas pré-visualização)"
                        >
                          Carregar nova foto
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Prévia local (gera Base64)</TooltipContent>
                    </Tooltip>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChosen}
                    />
                  </div>
                </TooltipProvider>

                {/* Campos ocultos controlados pelo file chooser */}
                <input type="hidden" {...register("imageBase64")} />
                <input type="hidden" {...register("imageContentType")} />
              </CardContent>
            </Card>
          </section>

          {/* Coluna direita — formulário */}
          <section aria-labelledby="form-title" className="space-y-6">
            <h2 id="form-title" className="sr-only">
              Informações do projeto
            </h2>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Nome do projeto
              </Label>
              {isLoadingAny ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="name"
                  placeholder="Ex.: Sistema de Gestão Escolar"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              )}
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-muted-foreground">
                Descrição
              </Label>
              {isLoadingAny ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Descreva o objetivo, escopo e resultados esperados…"
                  aria-invalid={!!errors.description}
                  {...register("description")}
                />
              )}
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Centro */}
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
            </div>

            {/* Tags a (re)selecionar (representa estado atual) */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Tags do projeto</Label>
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
            </div>

            {/* Tags a remover (apenas visual; será ignorado no submit) */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Remover tags</Label>
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
              {isLoadingAny ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="ownerId"
                  placeholder="UUID do responsável"
                  aria-invalid={!!errors.ownerId}
                  {...register("ownerId")}
                />
              )}
              {errors.ownerId && (
                <p className="text-sm text-destructive">{errors.ownerId.message}</p>
              )}
            </div>

            {/* Tamanho da equipe */}
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-sm text-muted-foreground">
                Tamanho da equipe
              </Label>
              {isLoadingAny ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="teamSize"
                  type="number"
                  min={1}
                  aria-invalid={!!errors.teamSize}
                  {...register("teamSize", { valueAsNumber: true })}
                />
              )}
              {errors.teamSize && (
                <p className="text-sm text-destructive">{errors.teamSize.message}</p>
              )}
            </div>

            {/* Inscrições abertas */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="openForApplications"
                checked={watch("openForApplications")}
                onCheckedChange={(v) =>
                  setValue("openForApplications", Boolean(v), { shouldValidate: true })
                }
                aria-label="Inscrições abertas"
              />
              <Label htmlFor="openForApplications">Inscrições abertas</Label>
            </div>

            <Separator />

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="min-w-40"
                disabled={isSubmitting || isLoadingAny}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}

/**
 * Testes manuais:
 * - Sem alterações de tags → envia toAdd: [], toRemove: []
 * - Adicionar/remover tags → envia apenas o delta
 * - Trocar imagem por arquivo → prévia local, PUT envia Data URL + mimetype
 */
