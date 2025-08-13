import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";

import { Header } from "@/components/Header";
import { TagsMultiSelect } from "@/components/form/TagsMultiSelect";

import {
    getCenters,
    getTags,
    getProjectById,
    updateProject,
} from "@/lib/api";
import type { Center, Tag, CreateProjectRequest, ProjectResponse } from "@/types/project";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import { getErrorMessage } from "@/lib/errors";

// Zod
const Schema = z
    .object({
        name: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
        description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres."),
        centerId: z.string().uuid("Selecione um centro válido."),
        ownerId: z.string().uuid("Informe um UUID válido para o responsável."),
        openForApplications: z.boolean(),
        imgUrl: z.string().url("Forneça uma URL de imagem válida."),
        teamSize: z.number().int().min(1, "Tamanho mínimo da equipe é 1."),
        tagsToBeAdded: z.array(z.string().uuid()),
        tagsToBeRemoved: z.array(z.string().uuid()),
        validForCreation: z.literal(true),
    })
    .strict();

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
    validForCreation: true,
};

export default function EditProjectPage() {
    const router = useRouter();
    const { id } = router.query as { id?: string };
    const { toast } = useToast();

    const [centers, setCenters] = React.useState<Center[]>([]);
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [loadingCenters, setLoadingCenters] = React.useState(true);
    const [loadingTags, setLoadingTags] = React.useState(true);
    const [loadingProject, setLoadingProject] = React.useState(true);

    // preview local (sem upload real)
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
    });

    const imgUrl = watch("imgUrl");
    const selectedTags = watch("tagsToBeAdded");
    const removedTags = watch("tagsToBeRemoved");

    // carregar centers e tags
    const fetchCenters = React.useCallback(async () => {
        try {
            setLoadingCenters(true);
            setCenters(await getCenters());
        } catch (error: unknown) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar centros",
                description: getErrorMessage(error),
            });
        } finally {
            setLoadingCenters(false);
        }
    }, [toast]);

    const fetchTags = React.useCallback(async () => {
        try {
            setLoadingTags(true);
            setTags(await getTags());
        } catch (error: unknown) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar tags",
                description: getErrorMessage(error),
            });
        } finally {
            setLoadingTags(false);
        }
    }, [toast]);

    const hydrateFormFromProject = React.useCallback((p: ProjectResponse) => {
        reset({
            name: p.name,
            description: p.description,
            centerId: p.centerId,
            ownerId: p.ownerId,
            openForApplications: p.openForApplications,
            imgUrl: p.imgUrl,
            teamSize: p.teamSize,
            tagsToBeAdded: p.tagIds ?? [],
            tagsToBeRemoved: [],
            validForCreation: true,
        });
        setLocalPreviewUrl(null);
    }, [reset]);

    const fetchProject = React.useCallback(async (projectId: string) => {
        try {
            setLoadingProject(true);
            const p = await getProjectById(projectId);
            hydrateFormFromProject(p);
        } catch (error: unknown) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar projeto",
                description: getErrorMessage(error),
            });
        } finally {
            setLoadingProject(false);
        }
    }, [toast, hydrateFormFromProject]);

    // efeito inicial
    React.useEffect(() => {
        if (!id) return;
        // rodar em paralelo
        void Promise.all([fetchProject(id), fetchCenters(), fetchTags()]);
    }, [id, fetchProject, fetchCenters, fetchTags]);

    // abrir seletor de arquivo (apenas pré-visualização local)
    const onChooseFileClick = () => fileInputRef.current?.click();
    const onFileChosen: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setLocalPreviewUrl(url);
        // aviso opcional ao usuário
        toast({
            title: "Pré-visualização aplicada",
            description: "Essa imagem não será enviada. Informe uma URL válida para salvar.",
        });
    };

    const onSubmit = async (values: FormValues) => {
        if (!id) return;
        const payload: CreateProjectRequest = {
            name: values.name,
            description: values.description,
            centerId: values.centerId,
            ownerId: values.ownerId,
            openForApplications: values.openForApplications,
            imgUrl: values.imgUrl, // apenas URL
            teamSize: values.teamSize,
            tagsToBeAdded: values.tagsToBeAdded,
            tagsToBeRemoved: values.tagsToBeRemoved,
            validForCreation: true,
        };

        try {
            await updateProject(id, payload);
            toast({ title: "Projeto atualizado com sucesso!" });
            router.push(`/projects/${id}`);
        } catch (error: unknown) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar projeto",
                description: getErrorMessage(error),
            });
        }
    };

    const isLoadingAny = loadingProject || loadingCenters || loadingTags;

    return (
        <>
            <Head>
                <title>Editar projeto • UniLink</title>
            </Head>

            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8">Editar projeto</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 lg:gap-10">
                    {/* Coluna esquerda — preview / imagem */}
                    <section aria-labelledby="preview-title">
                        <h2 id="preview-title" className="sr-only">Pré-visualização da imagem</h2>

                        <Card className="rounded-3xl shadow-sm">
                            <CardContent className="p-4">
                                <div className="relative bg-muted rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
                                    {isLoadingAny ? (
                                        <Skeleton className="w-full h-full" />
                                    ) : (localPreviewUrl || imgUrl) ? (
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
                                                    onClick={onChooseFileClick}
                                                    aria-label="Carregar nova foto (apenas pré-visualização)"
                                                >
                                                    Carregar nova foto
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Prévia local (não faz upload)</TooltipContent>
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

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="imgUrl" className="text-sm text-muted-foreground">
                                        URL da imagem (persistida)
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

                                {/* TODO: integrar upload real no backend e preencher imgUrl com a URL retornada */}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Coluna direita — formulário */}
                    <section aria-labelledby="form-title" className="space-y-6">
                        <h2 id="form-title" className="sr-only">Informações do projeto</h2>

                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-muted-foreground">Nome do projeto</Label>
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
                            <Label htmlFor="description" className="text-sm text-muted-foreground">Descrição</Label>
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

                        {/* Tags a adicionar */}
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

                        {/* Tags a remover */}
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
                            <Label htmlFor="ownerId" className="text-sm text-muted-foreground">Responsável (ownerId)</Label>
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
                            <Label htmlFor="teamSize" className="text-sm text-muted-foreground">Tamanho da equipe</Label>
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
