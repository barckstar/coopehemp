// Placeholder de imagen 100% local (SVG en data-URI).
//
// El catálogo sembrado usa thumbnails de placehold.co; ese servicio externo
// rate-limitea las ráfagas (10 cards cargan a la vez) y deja imágenes en blanco
// de forma intermitente en la demo. `resolveImage` reemplaza esas URLs por un
// SVG generado en el cliente —instantáneo, sin red, imposible de rate-limitear y
// visualmente idéntico (misma caja de color + texto). Las URLs que NO son de
// placehold.co (p. ej. una foto real subida en el admin de Medusa) pasan intactas.

const PLACEHOLD_RE = /^https?:\/\/placehold\.co\/(\d+)x(\d+)\/([0-9a-fA-F]{3,8})\/[^?]*(?:\?text=([^&]*))?/;

function escapeXml(s: string): string {
  const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' };
  return s.replace(/[<>&'"]/g, (c) => map[c]);
}

function localPlaceholder(w: number, h: number, bg: string, text: string): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<rect width='100%' height='100%' fill='#${bg}'/>` +
    `<text x='50%' y='50%' fill='#ffffff' font-family='Arial,Helvetica,sans-serif' font-size='44' ` +
    `font-weight='bold' text-anchor='middle' dominant-baseline='middle'>${escapeXml(text)}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Devuelve una URL de imagen mostrable. Convierte placehold.co → SVG local; el resto pasa intacto. */
export function resolveImage(url?: string | null, fallbackLabel = ''): string {
  if (!url) return localPlaceholder(800, 600, '14532d', fallbackLabel);
  const m = url.match(PLACEHOLD_RE);
  if (!m) return url; // foto real u otra URL → sin tocar
  const [, w, h, bg, rawText] = m;
  const text = decodeURIComponent((rawText ?? '').replace(/\+/g, ' ')) || fallbackLabel;
  return localPlaceholder(Number(w), Number(h), bg, text);
}
