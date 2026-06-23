/**
 * Genera 60 frames placeholder (SVG) de una planta de cáñamo "madurando".
 * Solo es un placeholder para ver el efecto de scroll-scrub funcionando:
 * reemplazar /public/frames/*.svg por los frames reales (.webp idealmente)
 * cuando estén listos.
 *
 *   node scripts/generate-placeholder-frames.cjs
 */
const fs = require('fs');
const path = require('path');

const TOTAL = 60;
const STAGES = [
  { name: 'La Semilla', accent: '#22c55e' },
  { name: 'Raíz y Suelo', accent: '#f59e0b' },
  { name: 'Fibra Bast', accent: '#10b981' },
  { name: 'Agramiza / Hurd', accent: '#94a3b8' },
  { name: 'La Flor', accent: '#a855f7' },
  { name: 'Extracción', accent: '#14b8a6' },
];
const FRAMES_PER_STAGE = TOTAL / STAGES.length;

const W = 1200;
const H = 1600;
const GROUND = 1410;
const CX = 600;

function leaf(x, y, scale, ang, color) {
  const rx = 110 * scale;
  const ry = 38 * scale;
  return `<ellipse cx="${x}" cy="${y}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${color}" transform="rotate(${ang} ${x} ${y})"/>`;
}

function frame(i) {
  const t = i / (TOTAL - 1); // 0 → 1
  const stageIdx = Math.min(STAGES.length - 1, Math.floor(i / FRAMES_PER_STAGE));
  const stage = STAGES[stageIdx];

  const stemH = 70 + t * 1040;
  const stemTop = GROUND - stemH;
  const stemW = 14 + t * 12;

  // Hojas: aparecen a medida que crece.
  const leafCount = Math.round(t * 9);
  let leaves = '';
  for (let k = 0; k < leafCount; k++) {
    const ly = GROUND - ((k + 1) * stemH) / (leafCount + 1);
    const scale = 0.5 + 0.6 * (1 - k / (leafCount + 1));
    leaves += leaf(CX - 60, ly, scale, -28, '#2aa257');
    leaves += leaf(CX + 60, ly, scale, 28, '#34b765');
  }

  // Flor: brota en el último tercio.
  let flower = '';
  if (t > 0.6) {
    const f = (t - 0.6) / 0.4; // 0 → 1
    const r = 26 + f * 70;
    let petals = '';
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const px = CX + Math.cos(a) * r * 0.8;
      const py = stemTop + Math.sin(a) * r * 0.8;
      petals += `<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${(r * 0.55).toFixed(0)}" fill="${stage.accent}" opacity="0.9"/>`;
    }
    flower = `${petals}<circle cx="${CX}" cy="${stemTop}" r="${(r * 0.5).toFixed(0)}" fill="#fde68a"/>`;
  }

  // Semilla en el suelo en los primeros frames.
  let seed = '';
  if (t < 0.12) {
    seed = `<ellipse cx="${CX}" cy="${GROUND - 10}" rx="34" ry="22" fill="#7c5a2e"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#06281a"/>
      <stop offset="1" stop-color="#0c4429"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="${CX}" cy="${GROUND + 10}" rx="540" ry="80" fill="#3a2a16"/>
  <ellipse cx="${CX}" cy="${GROUND}" rx="540" ry="64" fill="#4a3620"/>
  ${seed}
  <path d="M${CX} ${GROUND} L${CX} ${stemTop.toFixed(0)}" stroke="#2fae5e" stroke-width="${stemW.toFixed(0)}" stroke-linecap="round"/>
  ${leaves}
  ${flower}
  <text x="60" y="100" font-family="system-ui, sans-serif" font-size="46" font-weight="800" fill="#ffffff" opacity="0.92">FRAME ${String(i + 1).padStart(2, '0')} / ${TOTAL}</text>
  <text x="60" y="158" font-family="system-ui, sans-serif" font-size="34" font-weight="700" fill="${stage.accent}">FASE 0${stageIdx + 1} · ${stage.name}</text>
  <text x="60" y="${H - 60}" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#ffffff" opacity="0.4">PLACEHOLDER — reemplazar por frames reales</text>
</svg>`;
}

const outDir = path.join(__dirname, '..', 'public', 'frames');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < TOTAL; i++) {
  const name = `frame-${String(i + 1).padStart(2, '0')}.svg`;
  fs.writeFileSync(path.join(outDir, name), frame(i), 'utf8');
}

console.log(`✅ ${TOTAL} frames generados en ${outDir}`);
