// Converte HEX para {r,g,b}
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// Luminância relativa (sRGB)
function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Retorna "black" ou "white" com base no contraste com o fundo
export function getReadableTextColor(hex: string): "black" | "white" {
  const { r, g, b } = hexToRgb(hex);
  const L = relativeLuminance(r, g, b);
  // Contraste simplificado: usar branco em fundos escuros (luminância baixa)
  return L > 0.5 ? "black" : "white";
}

// Gera rgba() a partir de HEX com alpha em [0,1]
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
