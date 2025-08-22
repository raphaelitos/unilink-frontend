import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import type { Tag, UUID } from "@/types/project";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  options: Tag[];
  value: UUID[];
  onChange: (v: UUID[]) => void;
  placeholder?: string;
};

export const TagsMultiSelect: React.FC<Props> = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const toggle = (id: UUID) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const clear = () => onChange([]);

  const selectedTags = React.useMemo(
    () => options.filter((t) => selectedSet.has(t.id)),
    [options, selectedSet]
  );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedTags.length > 0
                ? `${selectedTags.length} selecionada(s)`
                : (placeholder ?? "Selecionar…")}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
          <Command aria-label="Selecionar tags" aria-multiselectable>
            <CommandInput placeholder="Filtrar tags..." />
            <CommandList>
              <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="max-h-64">
                  {options.map((t) => {
                    const isSelected = selectedSet.has(t.id);
                    return (
                      <CommandItem
                        key={t.id}
                        value={t.name}
                        onSelect={() => toggle(t.id)}
                        role="option"
                        aria-selected={isSelected}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-full border"
                          style={{ backgroundColor: t.colorHex, borderColor: t.colorHex }}
                          aria-hidden
                        />
                        <span className="flex-1">{t.name}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Chips selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="listbox" aria-multiselectable>
          {selectedTags.map((t) => (
            <Badge
              key={t.id}
              variant="secondary"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              role="option"
              aria-selected
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: t.colorHex }}
              />
              {t.name}
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className="ml-1 inline-flex"
                aria-label={`Remover ${t.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
};
