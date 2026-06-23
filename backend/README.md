# CoopeHemp — Backend

Servidor API basado en **Medusa.js v2** para la plataforma cooperativa CoopeHemp.  
Expone e-commerce nativo de Medusa, gestión de noticias multilingüe y un sistema de
newsletter con envío de campañas desde el panel de administración.

---

## Tabla de contenidos

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Arquitectura del proyecto](#2-arquitectura-del-proyecto)
3. [Requisitos previos](#3-requisitos-previos)
4. [Configuración del entorno](#4-configuración-del-entorno)
5. [Instalación y arranque — Desarrollo](#5-instalación-y-arranque--desarrollo)
6. [Instalación y arranque — Docker (producción local)](#6-instalación-y-arranque--docker-producción-local)
7. [Migraciones de base de datos](#7-migraciones-de-base-de-datos)
8. [Módulo Blog / Noticias](#8-módulo-blog--noticias)
9. [Módulo Newsletter](#9-módulo-newsletter)
10. [Referencia de API — Store (pública)](#10-referencia-de-api--store-pública)
11. [Referencia de API — Admin (autenticada)](#11-referencia-de-api--admin-autenticada)
12. [Panel de administración](#12-panel-de-administración)
13. [Configuración de email](#13-configuración-de-email)
14. [Integración con el frontend](#14-integración-con-el-frontend)
15. [Despliegue en producción (Railway)](#15-despliegue-en-producción-railway)
16. [Variables de entorno — referencia completa](#16-variables-de-entorno--referencia-completa)
17. [Notas de seguridad](#17-notas-de-seguridad)

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework API | [Medusa.js](https://medusajs.com/) | 2.15.5 |
| Runtime | Node.js | ≥ 20 |
| Lenguaje | TypeScript | 5.6 |
| Base de datos | PostgreSQL | 16 |
| Caché / eventos | Redis | 7 |
| Email dev | [Mailpit](https://mailpit.axllent.org/) | latest |
| Email prod | SMTP configurable (Resend recomendado) | — |
| Contenedores | Docker + Docker Compose | — |
| Admin UI | Medusa Dashboard v2 + React custom routes | 2.15.5 |

---

## 2. Arquitectura del proyecto

```
src/
├── modules/                  ← Módulos de dominio propios
│   ├── blog/
│   │   ├── models/
│   │   │   └── blog-post.ts  ← Entidad BlogPost (MikroORM)
│   │   ├── service.ts        ← CRUD auto + métodos de negocio
│   │   └── index.ts          ← Registro del módulo en Medusa
│   └── newsletter/
│       ├── models/
│       │   ├── newsletter-subscriber.ts
│       │   └── newsletter-campaign.ts
│       ├── service.ts        ← CRUD + lógica de envío de campañas
│       └── index.ts
│
├── api/
│   ├── store/                ← Endpoints públicos (sin auth)
│   │   ├── blog/             ← GET listado y detalle de noticias
│   │   └── newsletter/       ← POST suscribir, GET desuscribir
│   └── admin/                ← Endpoints protegidos (requieren sesión admin)
│       ├── blog/             ← CRUD completo de artículos
│       └── newsletter/       ← CRUD campañas + suscriptores + envío
│
└── admin/
    └── routes/               ← Páginas React inyectadas en el panel de Medusa
        ├── blog/page.tsx
        └── newsletter/page.tsx

medusa-config.ts              ← Configuración central (CORS, módulos, BD, Redis)
docker-compose.yml            ← Postgres + Redis + Mailpit + Medusa (prod local)
Dockerfile                    ← Build multi-stage optimizado para producción
```

### Flujo de datos en módulos personalizados

```
HTTP Request
    │
    ▼
src/api/**/*.route.ts   ← validación básica de input
    │
    ▼ req.scope.resolve(MODULE_KEY)
Module Service          ← lógica de negocio, acceso a BD via MikroORM
    │
    ▼
PostgreSQL
```

El sistema de módulos de Medusa v2 inyecta los servicios mediante un contenedor DI
(Dependency Injection). Cada módulo declara sus modelos y Medusa genera automáticamente
las tablas y los métodos CRUD básicos a través de `MedusaService`.

---

## 3. Requisitos previos

| Herramienta | Versión mínima | Notas |
|---|---|---|
| Node.js | 20 o 22 LTS | ⚠️ **Node 24 NO funciona** — rompe el CLI de Medusa (`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`). Usá `nvm use 20`/`22`, o corré todo por Docker (§6), que usa node:20 dentro del contenedor. |
| npm | 10+ | Incluido con Node 20 |
| Docker | 24+ | Solo necesario para el stack completo |
| Docker Compose | v2 (plugin) | `docker compose` (sin guión) |
| Git | cualquiera | — |

---

## 4. Configuración del entorno

Copia el archivo de plantilla y ajusta los valores:

```bash
cp .env.template .env
```

Para desarrollo local el archivo `.env.template` ya está preconfigurado para conectarse
a los contenedores Docker del `docker-compose.yml`. **Nunca commites el `.env`**; está
en `.gitignore`.

---

## 5. Instalación y arranque — Desarrollo

Este modo usa Node.js directamente con hot-reload, más cómodo para iterar.  
Solo los servicios de infraestructura (Postgres, Redis, Mailpit) corren en Docker.

> ⚠️ **Requiere Node 20 o 22 LTS** (corre Medusa en el host). Con **Node 24 falla**. Si estás en
> Node 24, usá el modo Docker (§6) con: `docker compose up -d --build` y luego cada paso de abajo
> como `docker compose exec medusa npx medusa ...`.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar infraestructura (Postgres, Redis, Mailpit)
docker compose up postgres redis mailpit -d

# 3. Primera vez — generar y ejecutar migraciones de BD
npm run db:generate
npm run db:migrate

# 4. Crear el usuario admin (Medusa v2 no lo crea solo)
npx medusa user -e admin@coopehemp.cr -p Admin1234!

# 5. Sembrar datos + generar/vincular la publishable key
#    (SIN estos pasos la tienda sale vacía en el frontend)
npx medusa exec ./src/scripts/seed.ts                     # blog + newsletter
npx medusa exec ./src/scripts/seed-commerce.ts            # productos, precios, inventario, sales channel
npx medusa exec ./src/scripts/setup-store.ts              # regiones, envío, payment provider (pp_system_default)
npx medusa exec ./src/scripts/create-publishable-key.ts   # genera la pk_... y la VINCULA al sales channel

# 6. Arrancar servidor con hot-reload
npm run dev
```

| Servicio | URL |
|---|---|
| API Medusa | http://localhost:9000 |
| Admin Panel | http://localhost:9000/app |
| Mailpit (bandeja dev) | http://localhost:8025 |

> La `create-publishable-key.ts` imprime la `pk_...` — copiala al `.env.local` del frontend
> (`VITE_MEDUSA_PUBLISHABLE_KEY`).

---

## 6. Instalación y arranque — Docker (producción local)

Levanta todo el stack en contenedores. Útil para probar el build de producción o en un
servidor sin Node instalado.

```bash
# Construir imagen y levantar todos los servicios
docker compose up --build -d

# Ver logs en tiempo real
docker compose logs -f medusa

# Parar todo
docker compose down

# Parar y borrar volúmenes de BD (⚠️ destructivo)
docker compose down -v
```

Las variables de entorno del contenedor Medusa están hardcoded en el `docker-compose.yml`
para desarrollo. En producción real se deben pasar como secretos del proveedor de hosting.

---

## 7. Migraciones de base de datos

Medusa v2 gestiona migraciones con su propia CLI basada en MikroORM.

```bash
# Generar archivos de migración a partir de los modelos actuales
npm run db:generate

# Aplicar migraciones pendientes
npm run db:migrate

# Revertir la última migración
npm run db:rollback
```

> **Cuándo ejecutar `db:generate`:** cada vez que agregues o modifiques un campo en
> cualquier modelo dentro de `src/modules/*/models/`. Medusa detecta la diferencia entre
> el esquema actual y la BD, y genera el SQL necesario.

### Tablas creadas por los módulos propios

| Tabla | Módulo | Descripción |
|---|---|---|
| `blog_post` | blog | Artículos de noticias con traducciones JSON |
| `newsletter_subscriber` | newsletter | Suscriptores con idioma y token de baja |
| `newsletter_campaign` | newsletter | Campañas con traducciones y estado de envío |

Las tablas del e-commerce (productos, pedidos, clientes, etc.) las crea Medusa Core de
forma automática en la primera migración.

---

## 8. Módulo Blog / Noticias

### Modelo de datos — `BlogPost`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | ULID (PK) | Generado automáticamente |
| `slug` | string | URL amigable, debe ser único |
| `cover_image` | string \| null | Ruta o URL absoluta de la imagen |
| `category` | string | Ej: `"Comunidad"`, `"Tecnología"` |
| `author_name` | string | Nombre visible del autor |
| `is_published` | boolean | `false` = borrador |
| `published_at` | datetime \| null | Se asigna al publicar |
| `translations` | JSON array | Ver estructura abajo |

#### Estructura de `translations`

```json
[
  {
    "locale": "es",
    "title": "Beneficios del Cáñamo",
    "excerpt": "Resumen corto visible en el listado...",
    "content": "<h2>Introducción</h2><p>El cáñamo...</p>"
  },
  {
    "locale": "en",
    "title": "Benefits of Hemp",
    "excerpt": "Short summary visible in the listing...",
    "content": "<h2>Introduction</h2><p>Hemp...</p>"
  }
]
```

- El campo `content` acepta **HTML completo** para riqueza editorial.
- Se puede agregar cualquier locale (`pt`, `fr`, etc.) sin cambiar el esquema.
- Si el frontend solicita un locale que no existe, la API hace **fallback a `es`**.

---

## 9. Módulo Newsletter

### Modelo — `NewsletterSubscriber`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | ULID (PK) | — |
| `email` | string (unique) | Correo del suscriptor |
| `locale` | string | Idioma preferido (`es`, `en`, etc.) |
| `is_active` | boolean | `false` cuando se da de baja |
| `unsubscribe_token` | string | Token hex de 64 chars para baja segura |

### Modelo — `NewsletterCampaign`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | ULID (PK) | — |
| `status` | string | `draft` → `sending` → `sent` \| `failed` |
| `sent_at` | datetime \| null | Momento del envío |
| `recipient_count` | number | Cuántos emails se enviaron con éxito |
| `translations` | JSON array | Ver estructura abajo |

#### Estructura de `translations` en campañas

```json
[
  {
    "locale": "es",
    "subject": "Últimas noticias de CoopeHemp — Diciembre",
    "body_html": "<h1>Hola {{email}}</h1><p>...</p><a href=\"{{unsubscribe_url}}\">Darse de baja</a>"
  },
  {
    "locale": "en",
    "subject": "Latest news from CoopeHemp — December",
    "body_html": "<h1>Hello {{email}}</h1><p>...</p><a href=\"{{unsubscribe_url}}\">Unsubscribe</a>"
  }
]
```

#### Variables de plantilla disponibles en `body_html`

| Variable | Reemplazada por |
|---|---|
| `{{unsubscribe_url}}` | URL completa de baja del suscriptor |
| `{{email}}` | Correo del destinatario |
| `{{locale}}` | Locale del destinatario (`es`, `en`...) |

### Lógica de envío de campañas

1. Solo campañas en estado `draft` pueden enviarse.
2. Se consultan todos los `NewsletterSubscriber` con `is_active = true`.
3. Para cada suscriptor se busca la traducción que coincide con su `locale`.
4. Si no existe esa traducción, se usa el fallback a `es` (o la primera disponible).
5. Se reemplazan las variables de plantilla.
6. Se envía vía SMTP (nodemailer). Los errores por dirección inválida se loguean pero
   no abortan el envío al resto de suscriptores.
7. Al finalizar el estado pasa a `sent` y se actualiza `recipient_count`.

---

## 10. Referencia de API — Store (pública)

Prefijo base: `http://localhost:9000/store`

Estos endpoints **no requieren autenticación** y son los que consume el frontend React.

---

### Noticias

#### `GET /store/blog`

Devuelve los artículos publicados, paginados, con la traducción del locale solicitado.

**Query params**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `locale` | string | `es` | Idioma de las traducciones devueltas |
| `category` | string | — | Filtrar por categoría |
| `page` | number | `1` | Página actual |
| `limit` | number | `9` | Artículos por página |

**Respuesta `200`**

```json
{
  "posts": [
    {
      "id": "01JA...",
      "slug": "beneficios-del-canamo",
      "cover_image": "/blog/hemp-leaves.jpg",
      "category": "Educación",
      "author_name": "Dr. Roberto Solís",
      "published_at": "2024-12-10T00:00:00.000Z",
      "title": "Beneficios del Cáñamo",
      "excerpt": "Exploramos las múltiples propiedades..."
    }
  ],
  "count": 12,
  "page": 1,
  "limit": 9
}
```

> El campo `content` (cuerpo completo) **no** se incluye en el listado para reducir el
> payload. Solo se devuelve en el endpoint de detalle.

---

#### `GET /store/blog/:id`

Devuelve un artículo completo por su ID, incluyendo el campo `content`.

**Query params:** `locale` (default `es`)

**Respuesta `200`**

```json
{
  "post": {
    "id": "01JA...",
    "slug": "beneficios-del-canamo",
    "cover_image": "/blog/hemp-leaves.jpg",
    "category": "Educación",
    "author_name": "Dr. Roberto Solís",
    "published_at": "2024-12-10T00:00:00.000Z",
    "title": "Beneficios del Cáñamo",
    "excerpt": "Exploramos las múltiples propiedades...",
    "content": "<h2>Introducción</h2><p>El cáñamo...</p>"
  }
}
```

**Respuesta `404`** si el post no existe o no está publicado.

---

#### `GET /store/blog/by-slug?slug=<slug>`

Igual que el anterior pero permite buscar por `slug` en lugar de ID.  
Útil para URLs semánticas (`/noticias/beneficios-del-canamo`).

---

### Newsletter

#### `POST /store/newsletter/subscribe`

Suscribe un correo al boletín. Si el email ya existe pero estaba dado de baja, lo reactiva.

**Body**

```json
{
  "email": "usuario@ejemplo.com",
  "locale": "es"
}
```

| Campo | Requerido | Descripción |
|---|---|---|
| `email` | ✓ | Correo electrónico válido |
| `locale` | — | Default `es`. Determina en qué idioma recibe los newsletters |

**Respuestas**

| Status | Descripción |
|---|---|
| `201` | Suscripción exitosa |
| `200` | Email reactivado (estaba dado de baja) |
| `400` | Email con formato inválido |
| `409` | Email ya está suscrito y activo |

---

#### `GET /store/newsletter/unsubscribe/:token`

Desactiva la suscripción del usuario usando el token único incluido en sus emails.  
Diseñado para ser el destino de `{{unsubscribe_url}}` en las plantillas de campaña.

**Respuestas**

| Status | Descripción |
|---|---|
| `200` | Baja exitosa |
| `404` | Token inválido o inexistente |

---

## 11. Referencia de API — Admin (autenticada)

Prefijo base: `http://localhost:9000/admin`

Todos los endpoints del admin **requieren** cookie de sesión autenticada. El panel de
Medusa la gestiona automáticamente. Para llamadas programáticas (scripts, CI, etc.)
usa un API key de admin.

---

### Blog

#### `GET /admin/blog`

Lista todos los artículos (publicados y borradores) con paginación.

**Query params:** `page`, `limit`, `is_published` (`true` / `false`)

**Respuesta:** `{ posts: BlogPost[], count, page, limit }`

---

#### `POST /admin/blog`

Crea un nuevo artículo.

**Body**

```json
{
  "slug": "innovacion-en-cultivos-2025",
  "cover_image": "/blog/greenhouse.jpg",
  "category": "Tecnología",
  "author_name": "Ing. Carlos Ruiz",
  "is_published": false,
  "translations": [
    {
      "locale": "es",
      "title": "Innovación en Cultivos 2025",
      "excerpt": "Nuestros nuevos invernaderos...",
      "content": "<p>Contenido completo en HTML</p>"
    },
    {
      "locale": "en",
      "title": "Crop Innovation 2025",
      "excerpt": "Our new greenhouses...",
      "content": "<p>Full HTML content</p>"
    }
  ]
}
```

Campos requeridos: `slug`, `category`, `author_name`, `translations` (al menos 1).

---

#### `GET /admin/blog/:id`

Devuelve el artículo completo incluyendo todas sus traducciones.

---

#### `PUT /admin/blog/:id`

Actualiza uno o más campos del artículo. Todos los campos son opcionales.  
Al enviar `is_published: true` sin `published_at`, se asigna la fecha actual.

---

#### `DELETE /admin/blog/:id`

Elimina el artículo permanentemente.

---

### Newsletter — Suscriptores

#### `GET /admin/newsletter/subscribers`

Lista todos los suscriptores. El campo `unsubscribe_token` **nunca** se expone en este endpoint por seguridad.

**Query params:** `page`, `limit`, `is_active` (`true` / `false`)

---

#### `DELETE /admin/newsletter/subscribers`

Elimina un suscriptor permanentemente.

**Body:** `{ "id": "01JA..." }`

---

### Newsletter — Campañas

#### `GET /admin/newsletter/campaigns`

Lista todas las campañas con su estado y métricas de envío.

---

#### `POST /admin/newsletter/campaigns`

Crea una nueva campaña en estado `draft`.

**Body**

```json
{
  "translations": [
    {
      "locale": "es",
      "subject": "Novedades de CoopeHemp",
      "body_html": "<h1>Hola {{email}}</h1><p>...</p><a href=\"{{unsubscribe_url}}\">Darse de baja</a>"
    }
  ]
}
```

---

#### `GET /admin/newsletter/campaigns/:id`

Devuelve la campaña completa con todas sus traducciones.

---

#### `PUT /admin/newsletter/campaigns/:id`

Actualiza las traducciones de una campaña. Solo funciona en campañas con estado `draft`.

---

#### `DELETE /admin/newsletter/campaigns/:id`

Elimina una campaña. No se puede eliminar una campaña en estado `sending`.

---

#### `POST /admin/newsletter/campaigns/:id/send`

**Dispara el envío** de la campaña a todos los suscriptores activos.  
Solo funciona si el estado es `draft`. El proceso es síncrono — la respuesta llega
cuando todos los emails han sido procesados.

> En campañas con muchos suscriptores considera convertir este proceso en un job
> asíncrono con el sistema de eventos de Medusa o una cola externa (BullMQ, Inngest).

**Respuesta `200`**

```json
{
  "message": "Campaña enviada a 247 suscriptores",
  "sent": 247
}
```

**Errores comunes**

| Status | Causa |
|---|---|
| `400` | La campaña no está en estado `draft` o no tiene traducciones |
| `404` | Campaña no encontrada |

---

## 12. Panel de administración

Medusa v2 incluye un dashboard React accesible en `http://localhost:9000/app`.  
Se han añadido dos rutas personalizadas accesibles desde la barra lateral:

### "Blog & Noticias"

- Tabla de artículos con estado, categoría y autor.
- Modal de creación/edición con soporte multilingüe: agrega o quita traducciones por locale.
- Checkbox para publicar/despublicar directamente desde el formulario.
- Eliminación con confirmación.

### "Newsletter"

Dos pestañas en la misma pantalla:

**Campañas**
- Tabla con estado, número de enviados y fecha de envío.
- Modal de composición: editor HTML por locale con botón de "Vista previa" que renderiza el email en un `<iframe>` sandboxed antes de enviar.
- Botón "Enviar" aparece solo en campañas `draft`. El resto solo permite eliminar o previsualizar.

**Suscriptores**
- Tabla de todos los suscriptores con estado (activo/dado de baja) e idioma.
- Eliminación permanente de suscriptores.

---

## 13. Configuración de email

El sistema usa **nodemailer** con configuración SMTP, lo que lo hace compatible con
cualquier proveedor de email.

### Desarrollo — Mailpit

Mailpit intercepta todos los emails sin enviarlos realmente. Puedes revisar los
mensajes capturados en `http://localhost:8025`.

La configuración en `.env` para desarrollo es:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

### Producción — Resend (recomendado)

[Resend](https://resend.com) ofrece un free tier de 3.000 emails/mes y tiene excelente
deliverability. Expone SMTP estándar, por lo que no requiere cambiar el código.

1. Crea cuenta en resend.com → Genera un API Key.
2. Verifica tu dominio (`coopehemp.cr`) en el panel de Resend para evitar spam.
3. Actualiza el `.env` de producción:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxxxxxxxxxx
SMTP_FROM=noreply@coopehemp.cr
```

### Otras opciones compatibles

| Proveedor | Host | Puerto | Seguridad |
|---|---|---|---|
| SendGrid | `smtp.sendgrid.net` | `587` | STARTTLS |
| Mailgun | `smtp.mailgun.org` | `587` | STARTTLS |
| Amazon SES | `email-smtp.<region>.amazonaws.com` | `465` | SSL |
| SMTP propio | tu dominio | `465` / `587` | SSL / STARTTLS |

---

## 14. Integración con el frontend

El frontend (React + Vite en `http://localhost:5173`) se conecta a la Store API.
Los headers CORS ya están configurados en `medusa-config.ts`.

### Ejemplo — Listar noticias

```typescript
// src/services/blog.ts
const BACKEND = import.meta.env.VITE_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

export async function getBlogPosts(locale: string, page = 1) {
  const res = await fetch(
    `${BACKEND}/store/blog?locale=${locale}&page=${page}&limit=9`
  )
  if (!res.ok) throw new Error("Error fetching posts")
  return res.json() // { posts, count, page, limit }
}
```

### Ejemplo — Suscribir al newsletter

```typescript
export async function subscribeNewsletter(email: string, locale: string) {
  const res = await fetch(`${BACKEND}/store/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, locale }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
```

### Variable de entorno en el frontend

Añade al `.env` del frontend (proyecto Vite):

```env
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
```

Y en producción apunta a la URL de Railway:

```env
VITE_MEDUSA_BACKEND_URL=https://coopehemp-backend.up.railway.app
```

---

## 15. Despliegue en producción (Railway)

> El frontend va en **Vercel**. El backend **no puede** ir en Vercel porque requiere un
> proceso Node.js persistente, PostgreSQL y Redis. Railway los provee todos en una sola
> plataforma con un free tier generoso.

### Pasos

1. **Crear proyecto en Railway** → New Project → Deploy from GitHub repo (selecciona
   el repo del backend).

2. **Agregar PostgreSQL** → New → Database → PostgreSQL. Railway inyecta `DATABASE_URL`
   automáticamente como variable de entorno.

3. **Agregar Redis** → New → Database → Redis. Railway inyecta `REDIS_URL`.

4. **Variables de entorno** → en el servicio Medusa, configura:

   ```
   NODE_ENV=production
   MEDUSA_BACKEND_URL=https://<tu-subdominio>.up.railway.app
   ADMIN_CORS=https://<tu-subdominio>.up.railway.app
   AUTH_CORS=https://<tu-subdominio>.up.railway.app,https://<tu-frontend>.vercel.app
   STORE_CORS=https://<tu-frontend>.vercel.app
   JWT_SECRET=<secret-seguro-aleatorio>
   COOKIE_SECRET=<secret-seguro-aleatorio>
   FRONTEND_URL=https://<tu-frontend>.vercel.app
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=resend
   SMTP_PASS=re_xxxx
   SMTP_FROM=noreply@coopehemp.cr
   ```

5. **Start command** → Railway detecta el `Dockerfile` automáticamente. Si no:
   `node .medusa/server/index.js`

6. **Migraciones en Railway** → en el panel del servicio, ejecuta:
   ```
   npx medusa db:migrate
   ```

7. **Crear usuario admin** → Railway → Open shell:
   ```bash
   npx medusa user -e admin@coopehemp.cr -p contraseña_segura
   ```

---

## 16. Variables de entorno — referencia completa

| Variable | Requerida | Default (dev) | Descripción |
|---|---|---|---|
| `DATABASE_URL` | ✓ | `postgres://coopehemp:coopehemp_pass@localhost:5432/coopehemp_db` | Cadena de conexión PostgreSQL |
| `REDIS_URL` | ✓ | `redis://localhost:6379` | Cadena de conexión Redis |
| `MEDUSA_BACKEND_URL` | ✓ | `http://localhost:9000` | URL pública del backend (usado por el admin) |
| `ADMIN_CORS` | ✓ | `http://localhost:7001` | Orígenes permitidos para el admin panel |
| `AUTH_CORS` | ✓ | `http://localhost:7001,http://localhost:5173` | Orígenes permitidos para auth |
| `STORE_CORS` | ✓ | `http://localhost:5173` | Orígenes permitidos para Store API |
| `JWT_SECRET` | ✓ | `coopehemp-jwt-secret-dev` | **Cambiar en producción** |
| `COOKIE_SECRET` | ✓ | `coopehemp-cookie-secret-dev` | **Cambiar en producción** |
| `FRONTEND_URL` | ✓ | `http://localhost:5173` | Base URL del frontend (para links de baja en emails) |
| `SMTP_HOST` | ✓ | `localhost` | Host SMTP |
| `SMTP_PORT` | ✓ | `1025` | Puerto SMTP |
| `SMTP_SECURE` | — | `false` | `true` para SSL/TLS (puerto 465) |
| `SMTP_USER` | — | — | Usuario SMTP (vacío = sin autenticación) |
| `SMTP_PASS` | — | — | Contraseña SMTP / API key |
| `SMTP_FROM` | — | `noreply@coopehemp.cr` | Dirección remitente de los emails |
| `NODE_ENV` | — | `development` | `production` en producción |

---

## 17. Notas de seguridad

- **JWT y Cookie secrets:** los valores de desarrollo son públicos en este repo.
  Genera valores aleatorios para producción:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- **Unsubscribe token:** se genera con `crypto.randomBytes(32)` (256 bits de entropía).
  No se expone en los endpoints del admin.

- **Admin endpoints:** todos los endpoints bajo `/admin/` están protegidos por el
  middleware de autenticación de sesión que incluye Medusa Core. No requieren
  implementación manual.

- **CORS:** configura `STORE_CORS`, `ADMIN_CORS` y `AUTH_CORS` exclusivamente con los
  orígenes reales de tu frontend y admin en producción. No uses `*`.

- **SQL Injection:** Medusa usa MikroORM con consultas parametrizadas. No hay
  interpolación directa de input en SQL.

- **Variables de entorno:** nunca expongas el `.env` en el repositorio. El `.gitignore`
  ya lo excluye.

---

*Documentación generada para CoopeHemp Backend v0.0.1 — Medusa.js 2.15.5*
