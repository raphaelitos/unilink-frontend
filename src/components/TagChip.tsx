import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  colorHex?: string;
  activeBgHex?: string;
};

function isValidHex(hex?: string): boolean {
  return !!hex && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex);
}

function safeHex(hex?: string): string {
  return isValidHex(hex) ? (hex as string) : "#6b7280";
}

export const TagChip = React.memo(function TagChip({
  label,
  active = false,
  onToggle,
  colorHex,
  activeBgHex,
}: Props) {
  const baseBg = safeHex(colorHex);
  const bg = active && isValidHex(activeBgHex) ? (activeBgHex as string) : baseBg;

  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "outline"}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={`${active ? "Remover" : "Adicionar"} filtro: ${label}`}
      className="rounded-full px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{
        backgroundColor: bg,
        color: "#fff",
        borderColor: "transparent",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle?.();
        }
      }}
    >
      {label}
    </Button>
  );
});

export default TagChip;
