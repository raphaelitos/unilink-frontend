import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border">
          <Skeleton className="w-full aspect-[16/9]" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TagsSkeleton: React.FC = () => {
  return (
    <div className="flex gap-x-3 overflow-x-auto py-1" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton className="h-10 w-2/3 max-w-xl mx-auto" />
      <Skeleton className="h-6 w-40 mx-auto mt-4" />
      <div className="my-8">
        <Skeleton className="h-0.5 w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
        <Skeleton className="w-full rounded-3xl aspect-square md:aspect-[4/3]" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
