# Guía de Usuario — CoopeHemp Admin

**Sistema:** Medusa.js v2 + Extensiones personalizadas  
**URL local:** http://localhost:9000/app  
**Versión:** 1.0 — Junio 2026

---

## Contenido

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Panel principal](#2-panel-principal)
3. [Pedidos (Orders)](#3-pedidos-orders)
4. [Productos (Products)](#4-productos-products)
5. [Inventario (Inventory)](#5-inventario-inventory)
6. [Clientes (Customers)](#6-clientes-customers)
7. [Promociones (Promotions)](#7-promociones-promotions)
8. [Listas de precio (Price Lists)](#8-listas-de-precio-price-lists)
9. [Extensión: Blog & Noticias](#9-extensión-blog--noticias)
10. [Extensión: Newsletter](#10-extensión-newsletter)
11. [Configuración (Settings)](#11-configuración-settings)

---

## 1. Acceso al sistema

1. Abrir el navegador y entrar a `http://localhost:9000/app`
2. Ingresar con las credenciales de administrador:
   - **Email:** admin@coopehemp.cr
   - **Contraseña:** la configurada durante el setup inicial
3. Al iniciar sesión por primera vez se recomienda cambiar la contraseña en **Settings → Team**.

> En producción la URL será la del servidor desplegado (ej. Railway.app).

---

## 2. Panel principal

Al ingresar se muestra el **Dashboard** con un resumen de actividad reciente: pedidos nuevos, ingresos y clientes registrados.

El menú lateral izquierdo contiene todas las secciones. En la parte inferior aparecen las extensiones personalizadas:
- **Blog & Noticias**
- **Newsletter**

---

## 3. Pedidos (Orders)

Esta sección muestra todos los pedidos realizados por los clientes desde la tienda en línea.

### Ver pedidos
- La lista muestra: número de pedido, cliente, fecha, monto total y estado.
- Los estados posibles son: **Pendiente**, **Completado**, **Cancelado**, **Requiere acción**.
- Haz clic en un pedido para ver el detalle completo.

### Detalle de un pedido
Dentro de un pedido puedes ver:
- **Items comprados:** productos, cantidades y precios
- **Información del cliente:** nombre, email, teléfono
- **Dirección de envío**
- **Método de pago**
- **Timeline:** historial de acciones sobre el pedido

### Acciones sobre un pedido
- **Fulfill (Completar envío):** marca los items como enviados, permite ingresar número de guía
- **Refund (Reembolso):** devuelve dinero al cliente de forma parcial o total
- **Cancel (Cancelar):** cancela el pedido completo

---

## 4. Productos (Products)

Gestión del catálogo de productos de CoopeHemp.

### Ver productos
La lista muestra imagen de portada, nombre, colección, estado (Publicado / Borrador) y número de variantes.

### Crear un producto
1. Clic en **+ New Product** (esquina superior derecha)
2. Completar los campos obligatorios:
   - **Title:** nombre del producto en español (ej. "Aceite CBD 500mg")
   - **Handle:** URL amigable, se genera automáticamente
   - **Description:** descripción detallada del producto
3. En la sección **Organization:**
   - **Type:** tipo de producto (ej. Aceites, Fibra, Cosméticos)
   - **Collection:** colección a la que pertenece
   - **Tags:** etiquetas para búsqueda
4. En **Variants:** agregar variantes con sus opciones (ej. tamaño: 30ml, 60ml)
5. En **Attributes:** peso, dimensiones (importante para cálculo de envío)
6. En **Thumbnail:** imagen principal del producto
7. En **Images:** galería de imágenes adicionales
8. Cambiar el estado de **Draft** a **Published** para que sea visible en la tienda
9. Clic en **Save** para guardar

### Editar un producto
1. Clic sobre el producto en la lista
2. Modificar los campos deseados
3. Clic en **Save**

### Gestionar variantes y precios
Dentro de un producto, en la sección **Variants:**
1. Clic en la variante para editarla
2. En **Pricing:** agregar el precio en la región correspondiente (CRC para colones costarricenses, USD para dólares)
3. **Stock:** ingresar el inventario disponible
4. **SKU:** código único de identificación del producto

---

## 5. Inventario (Inventory)

Control del stock de cada variante de producto.

### Ver inventario
La lista muestra cada ítem de inventario con su SKU, nombre y cantidad disponible.

### Ajustar stock
1. Clic sobre el ítem de inventario
2. En la sección **Locations:** ver el stock por ubicación/bodega
3. Clic en **Edit quantity** para modificar manualmente la cantidad
4. Ingresar el nuevo valor y confirmar

> El inventario se descuenta automáticamente cuando se completa un pedido (fulfill).

---

## 6. Clientes (Customers)

Registro de todos los clientes que han creado cuenta o realizado pedidos.

### Ver clientes
La lista muestra nombre, email, número de pedidos y fecha de registro.

### Detalle de un cliente
Al hacer clic en un cliente se puede ver:
- **Información personal:** nombre, email, teléfono
- **Historial de pedidos:** todos los pedidos realizados
- **Direcciones guardadas**
- **Grupos:** a qué grupos de clientes pertenece (útil para precios especiales)

### Crear un cliente manualmente
1. Clic en **+ New Customer**
2. Completar nombre, email y contraseña temporal
3. El cliente recibirá acceso a su cuenta

### Grupos de clientes
Los grupos permiten aplicar descuentos o precios especiales a segmentos específicos (ej. socios de la cooperativa, mayoristas).

1. Ir a **Customers → Groups**
2. Clic en **+ New Group**
3. Dar un nombre al grupo y agregar clientes

---

## 7. Promociones (Promotions)

Gestión de descuentos y códigos promocionales.

### Ver promociones activas
La lista muestra código, tipo, valor del descuento y estado (Activo / Inactivo).

Los códigos pre-configurados de CoopeHemp son:
- **BIENVENIDO10** — 10% de descuento para nuevos clientes
- **HEMP20** — 20% de descuento en toda la tienda

### Crear una promoción
1. Clic en **+ Add Promotion**
2. Seleccionar el tipo:
   - **Standard:** aplica al total del pedido
   - **Buy X Get Y:** compra X producto y recibe descuento en Y
3. Completar:
   - **Code:** código que el cliente ingresa en el carrito (ej. VERANO25)
   - **Value:** monto o porcentaje del descuento
   - **Type:** porcentaje (%) o monto fijo
4. En **Conditions:** agregar restricciones opcionales:
   - Monto mínimo de compra
   - Productos o colecciones específicas
   - Límite de usos totales o por cliente
5. Clic en **Save**

### Activar / Desactivar una promoción
1. Entrar al detalle de la promoción
2. Cambiar el estado con el toggle en la esquina superior derecha

---

## 8. Listas de precio (Price Lists)

Las listas de precio permiten aplicar precios especiales a grupos de clientes o en períodos de tiempo determinados.

### Ver listas de precio
La lista muestra el nombre, tipo (Venta / Anulación), fechas de vigencia y estado.

Las listas pre-configuradas de CoopeHemp:
- **Precio Socio Cooperativa** — 15% de descuento para socios
- **Black Friday Hemp** — 30% de descuento, activo en noviembre

### Crear una lista de precio
1. Clic en **+ Add Price List**
2. Completar:
   - **Name:** nombre descriptivo
   - **Type:**
     - **Sale:** agrega precios de oferta sobre el precio normal
     - **Override:** reemplaza completamente el precio normal
   - **Starts at / Ends at:** fechas de vigencia (dejar vacío para que sea permanente)
3. En **Customer groups:** seleccionar qué grupos reciben esta lista
4. En **Prices:** agregar los productos y sus precios especiales:
   - Clic en **+ Add prices**
   - Buscar el producto/variante
   - Ingresar el precio especial
5. Clic en **Save**

---

## 9. Extensión: Blog & Noticias

Gestión del blog y noticias de CoopeHemp que se muestran en la página web.

### Ver artículos

Al entrar a **Blog & Noticias** en el menú lateral se muestra la lista de artículos con:
- Imagen de portada
- Título (en el idioma seleccionado)
- Categoría
- Autor
- Estado: **Publicado** (verde) o **Borrador** (gris)

**Cambiar idioma de la tabla:** Usa los botones **ES / EN / PT / FR** sobre la tabla para ver los títulos en el idioma deseado. Si un artículo no tiene traducción al idioma seleccionado, muestra el texto en español por defecto.

### Crear un artículo

1. Clic en **+ Nuevo artículo**
2. Completar los datos del artículo:
   - **Slug:** identificador único en la URL (ej. `beneficios-cbd-2026`). Sin espacios, solo letras minúsculas y guiones
   - **Categoría:** tema del artículo (ej. Comunidad, Investigación, Productos, Normativa)
   - **Autor:** nombre completo del autor
   - **Imagen de portada (URL):** pegar la URL de la imagen principal (Cloudinary, imgbb, Unsplash, etc.)
3. Marcar **Publicar inmediatamente** si el artículo debe aparecer en la web de una vez. Si se deja sin marcar queda como borrador.
4. **Galería de imágenes:** agregar hasta 8 imágenes adicionales:
   - Clic en **+ Añadir URL**
   - Pegar la URL de la imagen
   - La miniatura aparece en tiempo real para confirmar que la URL es correcta
   - Para eliminar una imagen clic en la **X** al lado
5. **Contenido en idiomas:** los tabs **ES / EN / PT / FR** permiten escribir el artículo en varios idiomas:
   - El tab activo muestra el contenido de ese idioma
   - Para agregar un idioma clic en **+ EN**, **+ PT**, etc.
   - Para quitar un idioma clic en **Quitar idioma** (solo si tiene más de uno)
   - Por cada idioma completar:
     - **Título:** título del artículo en ese idioma
     - **Resumen (excerpt):** texto corto para la vista previa en la lista de blog (2-3 oraciones)
     - **Contenido (Markdown):** cuerpo completo del artículo

### Editor de Markdown

El contenido usa formato **Markdown**. A la izquierda escribes el texto, a la derecha ves la **Vista Previa** en tiempo real de cómo quedará en la página web.

Referencia rápida de Markdown:

| Lo que escribes | Cómo se ve |
|---|---|
| `## Título de sección` | Título grande |
| `### Subtítulo` | Título mediano |
| `**texto en negrita**` | **texto en negrita** |
| `*texto en cursiva*` | *texto en cursiva* |
| `- ítem de lista` | • ítem de lista |
| `1. ítem numerado` | 1. ítem numerado |
| `> texto de cita` | Bloque de cita verde |
| `` `código` `` | Texto en código |
| `[texto](https://url.com)` | Enlace clicable |
| `---` | Línea separadora |

**Consejo:** Dos saltos de línea crean un párrafo nuevo. Un solo salto de línea es un salto de línea simple.

6. Clic en **Crear artículo** para guardar

### Editar un artículo existente

1. Clic en **Editar** en la fila del artículo
2. Modificar los campos necesarios
3. Clic en **Guardar cambios**

### Publicar / Despublicar un artículo

Para publicar un borrador o despublicar un artículo activo:
1. Clic en **Editar**
2. Marcar o desmarcar **Publicar inmediatamente**
3. Clic en **Guardar cambios**

### Eliminar un artículo

1. Clic en **Eliminar** en la fila del artículo
2. Confirmar en el diálogo de confirmación

> Esta acción es irreversible. Se recomienda despublicar en lugar de eliminar si hay duda.

---

## 10. Extensión: Newsletter

Gestión de suscriptores y envío de campañas de email marketing.

### Pestaña Campañas

Muestra todas las campañas creadas con su estado:
- **Borrador** — creada pero no enviada, se puede editar
- **Enviando** — en proceso de envío (no se puede editar ni eliminar)
- **Enviada** — completada, muestra fecha y cantidad de destinatarios

#### Crear una campaña

1. Clic en **+ Nueva campaña**
2. Para agregar idiomas adicionales clic en **+ EN**, **+ PT**, etc.
3. Por cada idioma completar:
   - **Asunto (Subject):** línea de asunto del email
   - **Cuerpo del correo (HTML):** contenido del email en formato HTML
     - Incluir `{{unsubscribe_url}}` en el cuerpo para insertar automáticamente el enlace de darse de baja
4. Clic en **Vista previa** para ver cómo se verá el email antes de enviar
5. Clic en **Crear campaña** para guardar como borrador

#### Enviar una campaña

Una campaña en estado **Borrador** se puede enviar:
1. Clic en **Enviar** en la fila de la campaña
2. Confirmar en el diálogo (esta acción es irreversible)
3. El sistema envía el email a todos los suscriptores activos en el idioma preferido de cada uno
4. Al finalizar el estado cambia a **Enviada** y muestra cuántos emails se enviaron

#### Editar una campaña

Solo las campañas en estado **Borrador** se pueden editar:
1. Clic en **Editar**
2. Modificar los textos
3. Clic en **Guardar cambios**

#### Eliminar una campaña

1. Clic en **Eliminar** (disponible para campañas en Borrador o Enviada, no durante el envío)
2. Confirmar en el diálogo

### Pestaña Suscriptores

Muestra todos los emails suscritos al newsletter con su idioma preferido y estado.

| Estado | Significado |
|---|---|
| Activo (verde) | Recibe los emails |
| Dado de baja (gris) | Se dio de baja, no recibe emails |

Los suscriptores se agregan automáticamente cuando alguien completa el formulario de newsletter en la página web.

#### Eliminar un suscriptor

1. Clic en **Eliminar** en la fila del suscriptor
2. Confirmar en el diálogo

> Nota: los suscriptores que se dan de baja desde el enlace en el email cambian a estado **Dado de baja** automáticamente — no se eliminan de la lista para mantener historial.

---

## 11. Configuración (Settings)

### Regiones (Regions)
Define los mercados activos: monedas, impuestos y métodos de pago disponibles por país.

CoopeHemp tiene configuradas:
- **Costa Rica** — Colón costarricense (CRC), sin impuesto agregado (el IVAI está incluido en los precios)
- **Internacional** — Dólar americano (USD)

### Tiendas (Store)
Información general de la tienda: nombre, email de soporte, moneda predeterminada.

### Usuarios (Team)
Gestión de los administradores con acceso al panel:
1. Ir a **Settings → Team**
2. Clic en **Invite User** para agregar un nuevo administrador
3. Ingresar el email y seleccionar el rol
4. El usuario recibirá un email de invitación

### Ubicaciones de stock (Locations)
Define las bodegas o puntos de almacenamiento del inventario. CoopeHemp tiene configurada la bodega principal en Costa Rica.

### Métodos de envío (Shipping)
Configura las tarifas y zonas de envío por región.

---

## Solución de problemas frecuentes

| Problema | Posible causa | Solución |
|---|---|---|
| El producto no aparece en la tienda | Estado en "Draft" | Cambiar a "Published" en el editor del producto |
| El precio no se muestra | No tiene precio configurado para la región | Editar la variante y agregar precio en la región correspondiente |
| El stock llegó a cero y no acepta pedidos | Inventario agotado | Ajustar cantidad en Inventory |
| La campaña no se envía | Configuración SMTP incorrecta | Revisar variables SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS en el servidor |
| El artículo del blog no aparece en la web | Estado en borrador | Marcar "Publicar inmediatamente" y guardar |
| La imagen del blog no carga | URL inválida o expirada | Usar URLs de servicios confiables (Cloudinary, imgbb) |

---

*Guía generada para CoopeHemp — Sistema de comercio electrónico basado en Medusa.js v2*
