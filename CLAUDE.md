# CLAUDE.md — CoopeHemp (raíz)

Monorepo de **CoopeHemp R.L.** — cooperativa de cáñamo industrial, Costa Rica.
Un único `.git` en esta raíz cubre ambas subcarpetas.

## Proyectos

| Carpeta | Qué es | Leer |
|---------|--------|------|
| `backend/` | API Medusa.js v2 — e-commerce + blog + newsletter | `backend/CLAUDE.md` |
| `frontend/` | Sitio público React 19 + Vite — consume la API store | `frontend/CLAUDE.md` |

## Stack resumen

| Capa | Tecnología |
|------|------------|
| Backend | Medusa.js 2.15.5, Node.js ≥20, TypeScript 5.6 |
| Base de datos | PostgreSQL 16 + Redis 7 |
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS 3, React Router v7 |
| i18n | Sistema casero (es/en), `LanguageContext.tsx` |
| Email dev | Mailpit |
| Deploy | Railway (backend) + Vercel o similar (frontend) |

## Arrancar todo en desarrollo

```bash
# Terminal 1 — Backend
cd backend
cp .env.template .env
# completar variables de entorno (ver backend/CLAUDE.md sección Variables)
npm install
npm run dev      # http://localhost:9000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env.local
# VITE_MEDUSA_URL=http://localhost:9000
# VITE_MEDUSA_PUBLISHABLE_KEY=pk_... (generada en backend)
npm install
npm run dev      # http://localhost:5173
```

## Estado conocido

**Frontend:** listo para entrega y responsive en todas las secciones (i18n es/en completo, Parallax
Vivo, navbar auto-hide, 404+ErrorBoundary, a11y, SEO/IA, perf). `build`/`lint` pasan. Pendiente:
formulario de contacto no envía (a definir con cliente), y SSG/prerender (SPA → puppeteer; vite-react-ssg
no sirve con React Router 7).

**Backend (e-commerce):** corregidos los bloqueantes de catálogo (publishable key ↔ sales channel y
productos ↔ sales channel) y el envío internacional, pero **falta correrlo**: el CLI de Medusa no
funciona con **Node 24** (usar Node 20/22 o Docker) y falta levantar el stack (Docker requiere
virtualización en BIOS + crear `backend/.env`).

- Pasarela de pago (Stripe/PayPal/SINPE) **no configurada** — checkout con proveedor manual. Se define en la reunión con el cliente.
- `products` consume backend (fallback mock si está caído); `directory` y `map` son mock; `blog` consume backend real.
- `npm run lint` y `npm run build` (frontend) deben pasar limpios antes de cualquier PR.

## Regla de trabajo

Siempre leer `backend/CLAUDE.md` o `frontend/CLAUDE.md` según el área antes de tocar código.
Este archivo es solo el índice del monorepo.
