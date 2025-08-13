import * as React from "react";
import type { Tag, UUID } from "@/types";
import { TagChip } from "@/components/TagChip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  tags: Tag[];
  selectedTagIds: UUID[];
  onToggleTag: (id: UUID) => void;
  openOnly?: boolean;
  onToggleOpenOnly?: () => void;
};

export const TagFilters: React.FC<Props> = ({
  tags,
  selectedTagIds,
  onToggleTag,
  openOnly = false,
  onToggleOpenOnly,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Filtros</h3>

        {/* Switch opcional — apenas UI */}
        {/*
        <div className="flex items-center gap-2">
          <Switch
            id="open-only"
            checked={openOnly}
            onCheckedChange={onToggleOpenOnly}
            aria-label="Alternar exibição de projetos com inscrições abertas"
          />
          <Label htmlFor="open-only" className="text-sm">
            Inscrições abertas
          </Label>
        </div>
        */}
      </div>

      <div
        className="flex gap-x-3 overflow-x-auto py-1"
        role="listbox"
        aria-label="Filtros por tags"
      >
        {tags.map((t) => {
          const active = selectedTagIds.includes(t.id);
          return (
            <TagChip
              key={t.id}
              label={t.name}
              active={active}
              onToggle={() => onToggleTag(t.id)}
              colorHex={t.colorHex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TagFilters;
