/**
 * Utilitários para manipulação de listas de tags (UUIDs).
 */

/** Remove falsy e duplicados preservando a ordem de aparição. */
export function dedupeUUIDs(list: string[]): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of list) {
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Normaliza um array possivelmente undefined/null para [] */
export function ensureArrays<T>(maybe: T[] | undefined | null): T[] {
  return Array.isArray(maybe) ? maybe : [];
}

/**
 * Calcula o delta entre original e selecionado:
 * - toAdd = selected - original
 * - toRemove = original - selected
 */
export function diffTagIds(original: string[], selected: string[]): {
  toAdd: string[];
  toRemove: string[];
} {
  const o = new Set(dedupeUUIDs(ensureArrays(original)));
  const s = new Set(dedupeUUIDs(ensureArrays(selected)));

  const toAdd: string[] = [];
  const toRemove: string[] = [];

  for (const id of s) if (!o.has(id)) toAdd.push(id);
  for (const id of o) if (!s.has(id)) toRemove.push(id);

  return { toAdd, toRemove };
}
