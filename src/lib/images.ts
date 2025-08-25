/**
 * Utilitários de imagem para upload via Base64.
 * Política: o backend espera SEMPRE uma Data URL completa em `imageBase64`,
 * ex.: "data:image/jpeg;base64,<dados...>".
 */

/** Regex para validar/pegar o mime de um Data URL de imagem */
const DATA_URL_RE = /^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,/;

/** Heurística simples para inferir MIME a partir do prefixo do base64 cru */
function detectMimeFromBase64(base64: string): string {
  const b64 = base64.slice(0, 16);
  // JPEG começa com /9j/
  if (b64.startsWith("/9j/")) return "image/jpeg";
  // PNG começa com iVBORw0KGgo
  if (b64.startsWith("iVBORw0KGgo")) return "image/png";
  // GIF começa com R0lGOD (GIF87a/89a -> "GIF" = R0lG)
  if (b64.startsWith("R0lGOD")) return "image/gif";
  // WEBP (RIFF) -> "RIFF" = R0lGR
  if (b64.startsWith("UklGR") || b64.startsWith("R0lGR")) return "image/webp";
  // BMP ("BM" = Qk)
  if (b64.startsWith("Qk")) return "image/bmp";
  // Fallback
  return "application/octet-stream";
}

/** Checa se uma string já é Data URL válida */
export function isDataURL(str: string): boolean {
  return DATA_URL_RE.test(str);
}

/** Garante que a string de entrada é um Data URL; se for base64 cru, cria o cabeçalho. */
export function ensureDataURL(input: string, mimeFallback = "image/jpeg"): string {
  if (!input) return "";
  if (isDataURL(input)) return input.trim();
  const normalized = input.replace(/\s+/g, ""); // remove quebras/espacos por segurança
  const mime = detectMimeFromBase64(normalized) || mimeFallback;
  return `data:${mime};base64,${normalized}`;
}

/** Converte um File em DataURL: "data:<mime>;base64,<...>" */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/**
 * Extrai a parte Base64 (sem prefixo) e o mime de um input que pode ser:
 *  - Data URL completo, ou
 *  - base64 cru (nesse caso, inferimos o mime por heurística).
 *
 * Observação: para enviar ao backend, PREFIRA mandar a Data URL completa.
 */
export function extractBase64AndMime(
  input: string
): { base64: string; mime: string } {
  if (!input) return { base64: "", mime: "application/octet-stream" };

  if (isDataURL(input)) {
    // Ex.: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
    const [header, base64 = ""] = input.split(",");
    const mimeMatch = header.match(DATA_URL_RE);
    const mime = mimeMatch?.[1] ?? "application/octet-stream";
    return { base64, mime };
  }

  // Base64 cru: normaliza e tenta inferir mime
  const base64 = input.replace(/\s+/g, "");
  const mime = detectMimeFromBase64(base64);
  return { base64, mime };
}

/** Valida se é imagem e respeita o limite de tamanho (MB) */
export function isAcceptedImage(file: File, maxMB = 5): boolean {
  const isImage = !!file.type && file.type.startsWith("image/");
  const withinSize = file.size <= maxMB * 1024 * 1024;
  return Boolean(isImage && withinSize);
}

/**
 * Helper de alto nível para montar o payload do backend a partir de um File.
 * Retorna:
 *  - imageBase64: Data URL completa (o que o backend espera)
 *  - imageContentType: mime do arquivo
 *  - dataURL: a mesma string (útil para pré-visualização)
 */
export async function buildImagePayload(file: File): Promise<{
  imageBase64: string;
  imageContentType: string;
  dataURL: string;
}> {
  const dataURL = await fileToDataURL(file); // "data:<mime>;base64,<...>"
  const { mime } = extractBase64AndMime(dataURL);
  return {
    imageBase64: ensureDataURL(dataURL),
    imageContentType: mime || file.type || "image/jpeg",
    dataURL,
  };
}
