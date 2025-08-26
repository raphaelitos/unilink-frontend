import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl shadow-sm overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TagsSkeleton: React.FC<{ count?: number }> = ({ count = 7 }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
      ))}
    </div>
  );
};

/** Skeleton para a página de DETALHE do projeto */
export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="h-9 sm:h-10 w-3/4 max-w-xl mx-auto" />
      <div className="flex justify-center mt-4">
        <Skeleton className="h-7 w-44 rounded-full" />
      </div>

      <div className="my-8">
        <Skeleton className="h-px w-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
        <div className="w-full">
          <Skeleton className="w-full aspect-square md:aspect-[4/3] rounded-3xl" />
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="rounded-2xl shadow-sm p-4 border">
              <Skeleton className="h-4 w-11/12 mb-2" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <div className="rounded-2xl shadow-sm p-4 border">
              <Skeleton className="h-4 w-5/12" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Alias de compatibilidade
export const DetailSkeleton = ProjectDetailSkeleton;

/** Skeleton para a página de EDIÇÃO do projeto */
export const ProjectEditSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="h-9 sm:h-10 w-64 max-w-xs mx-auto" />
      <div className="my-8">
        <Skeleton className="h-px w-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
        {/* Coluna esquerda: preview quadrado */}
        <div className="w-full">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="mt-4 flex justify-center gap-3">
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Coluna direita: campos do formulário */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="mt-6 flex justify-end">
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
};
