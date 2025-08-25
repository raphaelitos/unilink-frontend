/**
 * Utilitários de imagem para upload via Base64.
 */

/** Converte um File em DataURL: "data:<mime>;base64,<...>" */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

/** Extrai a parte Base64 (sem prefixo) e o mime de um DataURL */
export function extractBase64AndMime(
  dataURL: string
): { base64: string; mime: string } {
  // Ex.: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
  const [header, base64] = dataURL.split(",");
  const mimeMatch = header.match(/^data:(.*?);base64$/);
  const mime = mimeMatch?.[1] ?? "application/octet-stream";
  return { base64: base64 ?? "", mime };
}

/** Valida se é imagem e respeita o limite de tamanho (MB) */
export function isAcceptedImage(file: File, maxMB = 5): boolean {
  const isImage = file.type?.startsWith("image/");
  const withinSize = file.size <= maxMB * 1024 * 1024;
  return Boolean(isImage && withinSize);
}
