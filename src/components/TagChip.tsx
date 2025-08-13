import * as React from "react";
import { Button } from "@/components/ui/button";
import { getReadableTextColor, withAlpha } from "@/lib/colors";

type Props = {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  colorHex?: string;
};

export const TagChip = React.memo(function TagChip({
  label,
  active = false,
  onToggle,
  colorHex,
}: Props) {
  const bg = colorHex ? withAlpha(colorHex, active ? 0.25 : 0.15) : undefined;
  {/*
    const textColor =
    colorHex ? (getReadableTextColor(colorHex) === "white" ? "white" : "black") : undefined;
    */}
    const textColor = "black";
    const borderColor = colorHex ? withAlpha(colorHex, 0.35) : undefined;

  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "outline"}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={`${active ? "Remover" : "Adicionar"} filtro: ${label}`}
      className="rounded-full px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={
        colorHex
          ? {
              backgroundColor: bg,
              color: textColor,
              borderColor: borderColor,
            }
          : undefined
      }
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
