# CoopeHemp — Backend

API basada en **Medusa.js v2** para CoopeHemp R.L. (cooperativa de cáñamo, Costa Rica). E-commerce
nativo de Medusa + dos módulos propios (Blog/Noticias multilingüe, Newsletter con envío de
campañas). Consumido por `../frontend` (React/Vite, ver `../frontend/CLAUDE.md`).

Parte de un monorepo: `Coopehemp/backend/` (este) + `Coopehemp/frontend/` + un único `.git` en la
raíz `Coopehemp/`. No hay `.git` propio aquí.

**La documentación detallada (referencia de API completa, modelos de datos, deploy) ya existe en
`README.md` (24 KB, español, muy completo) y `GUIA_USUARIO.md` (guía del panel admin para usuarios
no técnicos). Este CLAUDE.md es un resumen orientado a retomar trabajo rápido — para el detalle
exacto de un endpoint, leer `README.md`.**

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Medusa.js | 2.15.5 |
| Lenguaje | TypeScript | 5.6 |
| DB | PostgreSQL | 16 |
| Cache/eventos | Redis | 7 |
| Email dev | Mailpit (Docker) | — |
| Email prod | SMTP genérico, Resend recomendado | — |

## Arrancar en desarrollo

```bash
npm install
cp .env.template .env        # completar DATABASE_URL, JWT_SECRET, COOKIE_SECRET (openssl rand -hex 32)
# Postgres + Redis + Mailpit corriendo (docker-compose.yml los trae, o local):
docker compose up -d postgres redis mailpit
npm run db:migrate
npm run dev                  # http://localhost:9000  (admin: http://localhost:9000/app)
```

Crear publishable key para el frontend:
```bash
npx medusa exec ./src/scripts/create-publishable-key.ts
```

Otros: `npm run build` / `npm run start` (prod), `npm run db:generate`, `npm run db:rollback`.
`docker-compose.yml` levanta el stack completo (Postgres + Redis + Mailpit + Medusa) para producción
local — puertos 9000 (API) y 7001 (admin) si se usa esa vía en vez de `medusa develop`.

## Arquitectura

```
src/
├── modules/                    ← Módulos de dominio propios (registrados en medusa-config.ts)
│   ├── blog/
│   │   ├── models/blog-post.ts       ← slug, cover_image, gallery[], category, author_name,
│   │   │                                is_published, published_at, translations[] (JSON)
│   │   ├── service.ts                ← extiende MedusaService(BlogPost) — CRUD auto
│   │   └── migrations/
│   └── newsletter/
│       ├── models/newsletter-subscriber.ts   ← email, locale, is_active, unsubscribe_token
│       ├── models/newsletter-campaign.ts     ← status (draft|sending|sent|failed), sent_at,
│       │                                        recipient_count, translations[] (subject+body_html)
│       ├── service.ts                ← CRUD + sendCampaign() (nodemailer, itera subscribers activos,
│       │                                resuelve traducción por locale con fallback a "es")
│       └── migrations/
├── api/
│   ├── store/    ← públicos, sin auth: GET /store/blog, GET /store/blog/:id (o by-slug),
│   │                POST /store/newsletter/subscribe, GET /store/newsletter/unsubscribe/:token
│   └── admin/    ← requieren sesión admin (middleware de Medusa, no hay que implementarlo):
│                    CRUD /admin/blog, /admin/newsletter/subscribers, /admin/newsletter/campaigns,
│                    POST /admin/newsletter/campaigns/:id/send
├── admin/routes/  ← páginas React inyectadas en el panel Medusa: blog/page.tsx, newsletter/page.tsx
└── scripts/       ← ejecutar con `npx medusa exec ./src/scripts/<nombre>.ts`
    ├── seed.ts                  ← datos iniciales de blog/newsletter
    ├── seed-commerce.ts         ← productos, variantes, precios, etc. (e-commerce demo)
    ├── setup-store.ts           ← config inicial de store/región
    ├── create-publishable-key.ts← genera la pk_... para el frontend
    ├── fix-thumbnails.ts        ← reemplaza thumbnails picsum.photos (con redirect, rompe en
    │                                redes locales) por placehold.co
    ├── fix-blog-images.ts       ← mismo arreglo pero para cover_image de blog posts
    └── check-sc.ts               ← inspección rápida vía Query module
```

`medusa-config.ts` registra los dos módulos propios y lee CORS/secrets/DB/Redis de `.env`.

## Modelo de datos — claves a recordar

- **BlogPost / NewsletterCampaign son multilingües por convención propia**, no por i18n de Medusa:
  el campo `translations` es un array JSON `{locale, ...}[]`, no relaciones. Al leer/escribir, el
  filtrado por idioma se hace en el `service.ts`, con fallback a `"es"` si no hay traducción para el
  locale pedido (ver `sendCampaign()` en `newsletter/service.ts` como ejemplo del patrón).
- `unsubscribe_token` se genera con `crypto.randomBytes(32)` — no exponerlo nunca en endpoints admin.
- El e-commerce (productos, carritos, pagos, orders) es 100% Medusa core — no hay módulo propio para
  eso, solo blog y newsletter son custom.

## Email

- Dev: Mailpit (SMTP en :1025, UI en `http://localhost:8025`) — todo lo que envía `sendCampaign()` se
  ve ahí, no sale a internet.
- Prod: cualquier SMTP estándar; el README documenta Resend como recomendado.
- Variables de plantilla soportadas en `body_html` de campañas: revisar README §9 antes de tocar
  `sendCampaign()` (reemplaza `{{unsubscribe_url}}`, etc. — confirmar lista exacta ahí).

## Pasarela de pago — pendiente

`.env.template` tiene bloques comentados para Stripe, PayPal y SINPE Móvil (custom). **Ninguno está
instalado ni registrado en `medusa-config.ts` todavía** — para activar uno: `npm install
@medusajs/payment-stripe` (o el que corresponda), agregar el módulo en `medusa-config.ts`, y
descomentar/completar las env vars correspondientes. El checkout del frontend (`../frontend`) ya
asume que existe al menos un payment provider configurado.

## Seguridad — antes de pasar a producción

- `JWT_SECRET` / `COOKIE_SECRET` de dev están en este repo en texto plano — **regenerar** con
  `openssl rand -hex 32` (o `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`).
- `ADMIN_CORS` / `AUTH_CORS` / `STORE_CORS` deben listar únicamente los orígenes reales de
  producción, nunca `*`.
- `.env` está en `.gitignore` — nunca commitearlo. `.env.template` es la plantilla pública sin secretos.

## Variables de entorno clave (ver `.env.template` para la lista completa)

```
DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET
MEDUSA_BACKEND_URL, ADMIN_CORS, AUTH_CORS, STORE_CORS, FRONTEND_URL
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
```

## Deploy

README §15 documenta despliegue en Railway paso a paso — seguir esa sección, no improvisar.

## Admin

- URL local: `http://localhost:9000/app`. Credenciales y recorrido de cada sección (Orders,
  Products, Inventory, Customers, Promotions, Price Lists, Blog & Noticias, Newsletter) en
  `GUIA_USUARIO.md` — es la guía para el usuario final no técnico, no duplicarla aquí.
- Crear el primer usuario admin: `npx medusa user -e admin@coopehemp.cr -p <password>`.
