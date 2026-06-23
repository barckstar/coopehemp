# CoopeHemp — Frontend

Sitio público de **CoopeHemp R.L.**, cooperativa de cáñamo industrial de Costa Rica.
SPA en React 19 + Vite que consume la API store de un backend Medusa.js v2 (carpeta `../backend`).
Bilingüe: español (por defecto) / inglés.

## Stack
- React 19 + TypeScript · Vite 7
- Tailwind CSS 3 (paleta `coope-green` / `coope-earth`)
- React Router DOM v7 · Framer Motion · Lucide React
- React Leaflet (mapa) · react-markdown + remark-gfm (blog)
- i18n propio (sin librería): `t()` / `tRaw()` sobre `src/i18n/es.json` y `en.json`

## Arrancar en desarrollo
```bash
npm install
cp .env.example .env.local   # VITE_MEDUSA_URL + VITE_MEDUSA_PUBLISHABLE_KEY
npm run dev                  # http://localhost:5173
```
El backend Medusa debe estar corriendo en `http://localhost:9000` (ver `../backend`).

Otros scripts: `npm run build` (`tsc -b && vite build`) · `npm run lint` · `npm run preview`.
Regenerar los frames placeholder del Parallax Vivo: `node scripts/generate-placeholder-frames.cjs`.

## Estructura
- `src/features/<página>/index.tsx` — una carpeta por página (home, about, products, blog, map,
  directory, transparency, contact, checkout, not-found).
- `src/i18n/` — diccionarios `es.json` / `en.json` + `LanguageContext`.
- `src/shared/` — `Navbar`, `Footer`, `MainLayout`, `ErrorBoundary`, `api/`, `hooks/`.
- `public/` — imágenes, `frames/` (Parallax Vivo), `robots.txt`, `sitemap.xml`, `llms.txt`.

## Características
- **i18n es/en** completo: todo el texto de UI vive en los JSON (regla del proyecto).
- **Parallax Vivo**: sección scroll-driven con secuencia de frames en el home (ver skill `parallax-vivo`).
- **Navbar** con auto-hide (se esconde al bajar) y estilo sólido/transparente según la página.
- Carrito + checkout (flujo Medusa), blog (consume backend), mapa de expendedoras, directorio, transparencia.
- **404 + ErrorBoundary** (evita pantalla en blanco).
- **SEO / IA**: meta + Open Graph + Twitter + 4× JSON-LD (Organization, WebSite, Breadcrumb, FAQ),
  `robots.txt`, `sitemap.xml`, `llms.txt`, hreflang es/en.
- **Accesibilidad**: aria-labels en botones de ícono, imágenes `loading="lazy"`.
- **Performance**: code-splitting por ruta + vendors (react/framer/router), preload del hero (LCP),
  Leaflet aislado en chunk lazy.

## Estado actual (entrega)
✅ Frontend **listo y responsive en todas las secciones**; `build` y `lint` pasan sin errores
(quedan 4 *warnings* advisory de `exhaustive-deps`, no bloquean).

Pendientes conocidos:
- **Formulario de contacto**: hoy no envía nada (a la espera de definir endpoint/servicio con el cliente).
- **Productos / tienda**: muestran datos de ejemplo hasta conectar el backend (Medusa) y su publishable key.
- **Pasarela de pago real** (SINPE / Stripe / PayPal): pendiente; el checkout opera con el proveedor manual (`pp_system_default`).
- **SSG / prerender**: la app es SPA. Para SEO en crawlers sin JS se evaluó prerender con navegador
  headless (puppeteer) — queda como tarea enfocada (vite-react-ssg NO sirve: incompatible con React Router 7).
- Datos *mock* no traducidos en `directory` y `map` (son datos, no texto de UI).
