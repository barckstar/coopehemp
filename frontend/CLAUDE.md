# CoopeHemp — Frontend

Sitio público de CoopeHemp R.L. (cooperativa de cáñamo, Costa Rica). React 19 + TypeScript + Vite,
consume la API store de un backend Medusa.js v2 (ver `../backend/CLAUDE.md`).

Este repo es parte de un monorepo: `Coopehemp/frontend/` (este) + `Coopehemp/backend/` + un único
`.git` en la raíz `Coopehemp/`. No hay `.git` propio aquí.

## Stack

- React 19 + TypeScript, Vite 7
- React Router DOM v7 (rutas en `src/App.tsx`, no en `src/app/` — ese path se eliminó, era código muerto)
- Tailwind CSS 3 (paleta custom `coope-green` / `coope-earth` en `tailwind.config.js`)
- Framer Motion (animaciones), Lucide React (iconos)
- React Leaflet (mapa de expendedoras), react-markdown + remark-gfm (render de posts del blog)
- i18n casero (no librería) — ver abajo

## Arrancar en desarrollo

```bash
npm install
cp .env.example .env.local   # completar VITE_MEDUSA_URL y VITE_MEDUSA_PUBLISHABLE_KEY
npm run dev                  # http://localhost:5173
```

El backend (Medusa) debe estar corriendo en `http://localhost:9000` (ver `../backend/CLAUDE.md`).
La publishable key se genera en el backend con:
```bash
npx medusa exec ./src/scripts/create-publishable-key.ts
```

Otros scripts: `npm run build` (`tsc -b && vite build`), `npm run lint`, `npm run preview`.

## Estructura

```
src/
├── App.tsx                       ← Rutas (BrowserRouter), lazy-loaded excepto Home
├── main.tsx                      ← Entry point: <LanguageProvider><App /></LanguageProvider>
├── i18n/
│   ├── LanguageContext.tsx       ← Context + hook useTranslation(); t('a.b.c') con dot-path
│   ├── es.json / en.json         ← Diccionarios (es = default, persistido en localStorage)
├── shared/
│   ├── api/
│   │   ├── client.ts             ← storeFetch(): fetch wrapper a `${VITE_MEDUSA_URL}/store/...`
│   │   ├── medusa-store.ts       ← productos, cart, shipping, payment, orders (tipado Medusa)
│   │   ├── blog.ts               ← listBlogPosts / getBlogPost (por id o slug)
│   │   └── newsletter.ts         ← subscribeNewsletter
│   ├── components/Navbar.tsx     ← Nav + dropdown "Cooperativa" + selector idioma + botón carrito
│   ├── components/Footer.tsx
│   ├── layouts/MainLayout.tsx    ← Envuelve <Outlet/> en <CartProvider> + monta <CartDrawer/>
│   └── hooks/useScrollToTop.tsx, useSEO.ts
└── features/                     ← Una carpeta por página/feature, cada una con su index.tsx
    ├── home, about, products, blog (+ Post.tsx para /blog/:slug), contact,
    │   map (Leaflet), directory, transparency, checkout, cart (CartContext + CartDrawer)
```

## Rutas (`src/App.tsx`)

Español como idioma de URL principal, con alias legacy en inglés:

| Ruta | Página | Alias |
|---|---|---|
| `/` | Home | — |
| `/about` | About | — |
| `/productos` | Products | `/products` |
| `/mapa` | VendingMap | — |
| `/directorio` | Directory | — |
| `/transparencia` | Transparency | — |
| `/blog`, `/blog/:slug` | Blog, BlogPost | — |
| `/contacto` | Contact | `/contact` |
| `/checkout` | Checkout | — |

## i18n — cómo funciona y reglas

- `useTranslation()` da `{ t, lang, setLang }`. `t('home.hero_title1')` resuelve por dot-path en
  `es.json`/`en.json`. Si la key no existe devuelve la key tal cual (no rompe, pero se nota).
- **Toda página debe usar `t()` para texto de interfaz** (headers, labels, botones, CTAs). Los
  *datos* hardcodeados como contenido de ejemplo (posts de blog, productos, miembros del
  directorio) no están traducidos todavía — son datos mock en el propio componente, no vienen
  del backend en `directory`/`products` (sí vienen del backend en `blog`).
- Si agregás una página nueva: agregá las keys en **ambos** `es.json` y `en.json` antes de usar `t()`,
  y llamá `useScrollToTop()` al inicio del componente (todas las páginas lazy-loaded lo hacen).

## Carrito y checkout

- `CartContext` (`features/cart/CartContext.tsx`): reducer + localStorage (`coopehemp_cart`).
  Items locales tienen `id: number` propio; cuando vienen de Medusa también cargan `variantId`
  (UUID) para poder armar el cart real en checkout.
- `CartProvider` vive en `MainLayout`, no en `main.tsx` — todo lo que esté fuera del `<Outlet/>`
  (no debería haber nada) no tiene acceso a `useCart()`.
- `features/checkout/index.tsx` (735 líneas) orquesta: crear cart en Medusa → dirección → shipping
  → payment session → completar cart → mostrar order. Usa `shared/api/medusa-store.ts` directamente.
- Pasarela de pago real (Stripe/PayPal/SINPE) **no está conectada todavía** — ver comentarios en
  `.env.example` del frontend y `.env.template` del backend. El flujo de checkout asume que el
  backend tiene al menos un payment provider configurado en `medusa-config.ts`.

## Convenciones del proyecto

- Una carpeta por feature en `src/features/<name>/index.tsx`; sub-páginas como `blog/Post.tsx`.
- Páginas con `useScrollToTop()` + `useTranslation()` al tope del componente.
- TypeScript con `verbatimModuleSyntax` activo (`tsconfig.app.json`) → los tipos puros (`ReactNode`,
  etc.) **deben** importarse con `import type { X } from 'react'`, separado del import de valores.
  Si el build tira `TS1484`, es por esto.
- Tailwind: usar siempre la paleta `coope-green-*` / `coope-earth-*`, no verdes genéricos de Tailwind.
- Links internos: usar `<Link>` de react-router, nunca `<a href>` ni `<button>` sin `onClick` para
  navegación (hubo un bug así en la página About, ya corregido).

## Estado conocido / pendientes

- Pasarela de pago real sin configurar (placeholders en `.env.example`).
- Datos mock sin traducir/sin venir del backend en `products`, `directory` y `map` (arrays hardcodeados
  en el propio componente). `blog` sí consume el backend real vía `listBlogPosts()`.
- `npm run lint` y `npm run build` deben pasar limpios antes de dar por buena cualquier sesión de
  trabajo — `tsc -b` ya detectó al menos un error real de `verbatimModuleSyntax` en el pasado.

## Variables de entorno (`.env.local`, ver `.env.example`)

```
VITE_MEDUSA_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=pk_...
# VITE_STRIPE_PUBLIC_KEY / VITE_PAYPAL_CLIENT_ID — cuando se defina la pasarela
```
