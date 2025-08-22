import * as React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <p className="text-lg font-medium">Nenhum projeto encontrado.</p>
      <p className="text-sm text-muted-foreground mt-1">
        Tente remover ou alterar os filtros.
      </p>
    </div>
  );
};

export default EmptyState;
