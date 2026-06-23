---
name: parallax-vivo
description: >
  Técnica "Parallax Vivo" — secciones scroll-driven donde una secuencia de imágenes/frames se
  reproduce ("scrubbing") al hacer scroll, combinada con capas parallax y tarjetas de texto que
  cambian por tramos, haciendo que la página se sienta VIVA. Usar cuando el usuario diga "Parallax
  Vivo", "scroll-frames", "que se mueva con el scroll", "páginas vivas", "efecto tipo Apple",
  "secuencia de imágenes al scrollear", o quiera animar una sección con muchas imágenes ligadas al
  scroll. Implementación de referencia en este repo: frontend/src/features/home/index.tsx (PlantJourney).
---

# Parallax Vivo

Patrón de **scroll-driven image sequence + parallax**. El usuario scrollea y una secuencia de N
imágenes (frames de un video/render) se reproduce cuadro a cuadro, dando sensación de movimiento /
"vida". Encima se apilan capas parallax (tinte, degradado, número decorativo) y opcionalmente un panel
de texto ("card") que avanza cada cierto número de frames.

## Cuándo usarla
- Hero o sección narrativa que cuente un proceso/transformación (una semilla que crece, un producto
  que se arma, un recorrido).
- Cuando el usuario quiera que algo "se mueva con el scroll" o que la página "parezca viva".

## Anatomía (la receta)

1. **Sección alta + panel pegajoso.** La `<section>` mide `N*100svh` de alto; adentro un panel
   `sticky top-0 h-[100svh]`. Eso da "pista de scroll" mientras el panel queda fijo en viewport.
2. **Progreso de scroll → índice de frame.** Con framer-motion:
   ```tsx
   const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
   useMotionValueEvent(scrollYProgress, 'change', (v) => {
     const idx = Math.min(TOTAL_FRAMES - 1, Math.round(v * (TOTAL_FRAMES - 1)));
     setFrame(idx);
     setActiveStage(Math.min(STAGES - 1, Math.floor(idx / FRAMES_PER_STAGE))); // card cada N frames
   });
   ```
3. **Render del frame.** Imagen única cuyo `src` cambia al frame actual (simple, sirve con SVG/WebP):
   ```tsx
   <img src={FRAME_SRCS[frame]} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
   ```
   Para MUCHOS frames raster pesados, usar `<canvas>` + `drawImage` en vez de swap de `<img>`.
4. **Precargar SIEMPRE** los frames para que el scrub no parpadee:
   ```tsx
   useEffect(() => { FRAME_SRCS.forEach((s) => { const i = new Image(); i.src = s; }); }, []);
   ```
5. **Capas parallax encima** del frame: tinte de color (`mix-blend-color`), degradado de fusión con
   el panel de texto, número/acento decorativo. Todas `pointer-events-none`.
6. **Card por tramos.** El texto (título, descripción, bullets) cambia cada `FRAMES_PER_STAGE` frames.
   Mantener lo estructural (iconos, colores, ids) en un `*.data.tsx` y el TEXTO en i18n (`t`/`tRaw`).

## Assets (frames)
- Reales: exportar un video/render a **N frames `.webp`** en `frontend/public/frames/`
  (`frame-01.webp … frame-NN.webp`) y apuntar `FRAME_SRCS` ahí.
- Placeholder para prototipar: `frontend/scripts/generate-placeholder-frames.cjs` genera 60 SVG de
  una planta creciendo (sirve para ver el efecto antes de tener los frames reales).
- Cantidad: ~30–60 frames; en móvil considerar un set reducido. Múltiplo del nº de cards
  (ej. 60 frames ÷ 6 cards = 10 frames/card).

## Gotcha conocido
La barra/cabecera de la sección `sticky top-0` queda **tapada por el navbar `fixed`**. Solución usada
en este repo: **navbar auto-hide** (se esconde al bajar, reaparece al subir) — ver
`frontend/src/shared/components/Navbar.tsx`. Alternativa: offset superior = altura del navbar.

## Referencia viva en el repo
`frontend/src/features/home/index.tsx` → componente **PlantJourney**: 60 frames, 6 cards, scrub
continuo + flip de texto por fase, capas parallax, integrado con i18n (`tRaw('home.stages...')`).
Copiar ese patrón y cambiar frames + textos para una sección nueva.
