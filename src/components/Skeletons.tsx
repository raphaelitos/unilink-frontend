import * as React from "react";

export const ProjectsSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border animate-pulse"
          aria-hidden="true"
        >
          <div className="aspect-[16/9] bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-2/3 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-6 w-14 bg-muted rounded-full" />
                <div className="h-6 w-10 bg-muted rounded-full" />
              </div>
              <div className="h-4 w-16 bg-muted rounded" />
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
        <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
      ))}
    </div>
  );
};
