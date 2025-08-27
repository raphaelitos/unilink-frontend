import * as React from "react";
import { useRouter } from "next/router";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserIdFromCookie } from "@/lib/jwt";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  projectId: string;
  ownerId?: string | null;
  className?: string;
};

export const FloatingEditButton: React.FC<Props> = ({
  projectId,
  ownerId,
  className,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = React.useCallback(() => {
    // Sem id do projeto → não faz nada
    if (!projectId) return;

    const currentUserId = getCurrentUserIdFromCookie();

    // Sem token ou inválido → login com retorno
    if (!currentUserId) {
      toast({
        title: "Login necessário",
        description: "Faça login para editar este projeto.",
      });
      const returnTo = typeof router.asPath === "string" ? router.asPath : `/projects/${projectId}`;
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    // Se não há ownerId no projeto, trate como sem permissão
    if (!ownerId) {
      toast({
        variant: "destructive",
        title: "Sem permissão",
        description: "Não foi possível validar a permissão de edição deste projeto.",
      });
      return;
    }

    // Permite apenas o dono
    if (currentUserId === ownerId) {
      router.push(`/projects/${projectId}/edit`);
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar este projeto.",
      });
    }
  }, [ownerId, projectId, router, toast]);

  // Não renderiza sem projectId
  if (!projectId) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            aria-label="Editar projeto"
            onClick={handleClick}
            className={[
              "fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50",
              "rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              className ?? "",
            ].join(" ")}
          >
            <Pencil className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          Editar projeto
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingEditButton;
