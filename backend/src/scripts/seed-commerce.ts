/**
 * Seed de comercio para CoopeHemp — Medusa v2
 *
 * Ejecutar:
 *   npx medusa exec src/scripts/seed-commerce.ts
 *
 * Siembra:
 *   - 1 Sales Channel
 *   - 2 Regions  (Centroamérica CRC + Internacional USD)
 *   - 5 Categorías de producto
 *   - 10 Productos con variantes (hemp temático)
 *   - Price Sets con precios en CRC y USD por variante
 *   - 1 Stock Location + Inventory items + levels (stock real)
 *   - 8 Clientes de muestra
 *   - 2 Promociones  (BIENVENIDO10 + HEMP20)
 *   - 1 Price List mayorista (15 % off para distribuidores)
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Precio en centavos / céntimos.
 *  CRC no usa decimales en práctica, pero Medusa los almacena en unidad mínima
 *  → multiplicamos por 100 (igual que USD). ₡4 500 = 450 000 */
const crc = (colones: number) => colones * 100
const usd = (dollars: number) => Math.round(dollars * 100)

// ─── Catálogo de productos ─────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Semillas & Nutrición",  handle: "semillas-nutricion",  description: "Semillas de cáñamo, harinas y proteínas" },
  { name: "Aceites & Extractos",   handle: "aceites-extractos",   description: "Aceites de semilla de cáñamo y extractos de CBD" },
  { name: "Cosmética Natural",     handle: "cosmetica-natural",   description: "Cuidado de la piel y cuerpo con cáñamo" },
  { name: "Fibra Textil",          handle: "fibra-textil",        description: "Fibra bast y productos de confección" },
  { name: "Construcción",          handle: "construccion",        description: "Agramiza y materiales de hempcrete" },
]

// Imágenes: picsum.photos/seed/{string}/800/600 → deterministas, siempre la misma imagen
// Formato Medusa: { url: string }[]
// price: { crc: colones, usd: dollars }
const PRODUCTS = [
  // ── Semillas ────────────────────────────────────────────────────────────────
  {
    title: "Semillas de Cáñamo Peladas",
    handle: "semillas-canamo-peladas",
    description: "Semillas de cáñamo 100 % costarricense, peladas y sin procesar. Fuente completa de proteína vegetal con todos los aminoácidos esenciales.",
    thumbnail: "https://picsum.photos/seed/ch-seeds-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-seeds-1/800/600",
      "https://picsum.photos/seed/ch-seeds-2/800/600",
      "https://picsum.photos/seed/ch-seeds-3/800/600",
    ],
    status: "published" as const,
    category: "semillas-nutricion",
    options: [{ title: "Presentación", values: ["250 g", "500 g", "1 kg"] }],
    variants: [
      { title: "250 g", sku: "SEED-250",  weight: 250,  options: { "Presentación": "250 g"  }, price: { crc: 4500,  usd: 8.99  }, stock: 200 },
      { title: "500 g", sku: "SEED-500",  weight: 500,  options: { "Presentación": "500 g"  }, price: { crc: 8000,  usd: 15.99 }, stock: 150 },
      { title: "1 kg",  sku: "SEED-1000", weight: 1000, options: { "Presentación": "1 kg"   }, price: { crc: 14500, usd: 27.99 }, stock: 80  },
    ],
  },
  {
    title: "Harina de Cáñamo",
    handle: "harina-canamo",
    description: "Harina obtenida del prensado en frío de la semilla de cáñamo. Alta en fibra y proteína, ideal para repostería saludable.",
    thumbnail: "https://picsum.photos/seed/ch-flour-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-flour-1/800/600",
      "https://picsum.photos/seed/ch-flour-2/800/600",
    ],
    status: "published" as const,
    category: "semillas-nutricion",
    options: [{ title: "Presentación", values: ["500 g", "1 kg"] }],
    variants: [
      { title: "500 g", sku: "FLOUR-500",  weight: 500,  options: { "Presentación": "500 g" }, price: { crc: 3500, usd: 6.99  }, stock: 120 },
      { title: "1 kg",  sku: "FLOUR-1000", weight: 1000, options: { "Presentación": "1 kg"  }, price: { crc: 6500, usd: 12.99 }, stock: 90  },
    ],
  },
  {
    title: "Proteína de Cáñamo en Polvo",
    handle: "proteina-canamo",
    description: "Proteína de cáñamo sin aditivos ni edulcorantes artificiales. 50 % de proteína por porción. Ideal para atletas y dietas plant-based.",
    thumbnail: "https://picsum.photos/seed/ch-protein-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-protein-1/800/600",
      "https://picsum.photos/seed/ch-protein-2/800/600",
    ],
    status: "published" as const,
    category: "semillas-nutricion",
    options: [{ title: "Presentación", values: ["500 g"] }],
    variants: [
      { title: "500 g", sku: "PROT-500", weight: 500, options: { "Presentación": "500 g" }, price: { crc: 7500, usd: 14.99 }, stock: 100 },
    ],
  },

  // ── Aceites ─────────────────────────────────────────────────────────────────
  {
    title: "Aceite de Semilla de Cáñamo",
    handle: "aceite-semilla-canamo",
    description: "Aceite prensado en frío, sin refinar. Ratio omega-6/omega-3 ideal 3:1. Para ensaladas, batidos y uso cosmético.",
    thumbnail: "https://picsum.photos/seed/ch-oil-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-oil-1/800/600",
      "https://picsum.photos/seed/ch-oil-2/800/600",
      "https://picsum.photos/seed/ch-oil-3/800/600",
    ],
    status: "published" as const,
    category: "aceites-extractos",
    options: [{ title: "Volumen", values: ["100 ml", "250 ml"] }],
    variants: [
      { title: "100 ml", sku: "OIL-100", weight: 120, options: { "Volumen": "100 ml" }, price: { crc: 6500,  usd: 12.99 }, stock: 180 },
      { title: "250 ml", sku: "OIL-250", weight: 290, options: { "Volumen": "250 ml" }, price: { crc: 14000, usd: 27.99 }, stock: 100 },
    ],
  },
  {
    title: "Aceite de CBD 500 mg",
    handle: "aceite-cbd-500",
    description: "Extracto full-spectrum de cáñamo costarricense con 500 mg de CBD por frasco. Aceite de semilla de cáñamo como vehículo.",
    thumbnail: "https://picsum.photos/seed/ch-cbd500-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-cbd500-1/800/600",
      "https://picsum.photos/seed/ch-cbd500-2/800/600",
    ],
    status: "published" as const,
    category: "aceites-extractos",
    options: [{ title: "Presentación", values: ["30 ml"] }],
    variants: [
      { title: "30 ml", sku: "CBD-500-30", weight: 45, options: { "Presentación": "30 ml" }, price: { crc: 18000, usd: 34.99 }, stock: 60 },
    ],
  },
  {
    title: "Aceite de CBD 1000 mg",
    handle: "aceite-cbd-1000",
    description: "Concentración doble. Extracto full-spectrum con 1 000 mg de CBD. Para usuarios con mayor requerimiento terapéutico.",
    thumbnail: "https://picsum.photos/seed/ch-cbd1000-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-cbd1000-1/800/600",
      "https://picsum.photos/seed/ch-cbd1000-2/800/600",
    ],
    status: "published" as const,
    category: "aceites-extractos",
    options: [{ title: "Presentación", values: ["30 ml"] }],
    variants: [
      { title: "30 ml", sku: "CBD-1000-30", weight: 45, options: { "Presentación": "30 ml" }, price: { crc: 32000, usd: 61.99 }, stock: 40 },
    ],
  },

  // ── Cosmética ────────────────────────────────────────────────────────────────
  {
    title: "Crema Facial Hidratante de Cáñamo",
    handle: "crema-facial-canamo",
    description: "Crema de día y noche con aceite de semilla de cáñamo y extracto de CBD. Sin parabenos, sin sulfatos. Para todo tipo de piel.",
    thumbnail: "https://picsum.photos/seed/ch-cream-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-cream-1/800/600",
      "https://picsum.photos/seed/ch-cream-2/800/600",
      "https://picsum.photos/seed/ch-cream-3/800/600",
    ],
    status: "published" as const,
    category: "cosmetica-natural",
    options: [{ title: "Presentación", values: ["60 ml"] }],
    variants: [
      { title: "60 ml", sku: "FACE-60", weight: 80, options: { "Presentación": "60 ml" }, price: { crc: 11000, usd: 21.99 }, stock: 75 },
    ],
  },
  {
    title: "Bálsamo Muscular CBD",
    handle: "balsamo-muscular-cbd",
    description: "Bálsamo de aplicación tópica con 250 mg de CBD, árnica y aceites esenciales de eucalipto y menta. Alivio muscular y articular.",
    thumbnail: "https://picsum.photos/seed/ch-balm-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-balm-1/800/600",
      "https://picsum.photos/seed/ch-balm-2/800/600",
    ],
    status: "published" as const,
    category: "cosmetica-natural",
    options: [{ title: "Presentación", values: ["90 g"] }],
    variants: [
      { title: "90 g", sku: "BALM-90", weight: 100, options: { "Presentación": "90 g" }, price: { crc: 9500, usd: 18.99 }, stock: 90 },
    ],
  },

  // ── Fibra textil ─────────────────────────────────────────────────────────────
  {
    title: "Fibra Bast de Cáñamo (Mayoreo)",
    handle: "fibra-bast-canamo",
    description: "Fibra bast procesada y clasificada. Para talleres textiles, artesanía y fabricación de tela de cáñamo. Venta por kilo.",
    thumbnail: "https://picsum.photos/seed/ch-fiber-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-fiber-1/800/600",
      "https://picsum.photos/seed/ch-fiber-2/800/600",
      "https://picsum.photos/seed/ch-fiber-3/800/600",
    ],
    status: "published" as const,
    category: "fibra-textil",
    options: [{ title: "Cantidad", values: ["1 kg", "5 kg", "25 kg"] }],
    variants: [
      { title: "1 kg",  sku: "FIBER-1",  weight: 1000,  options: { "Cantidad": "1 kg"  }, price: { crc: 12000,  usd: 23.99  }, stock: 200 },
      { title: "5 kg",  sku: "FIBER-5",  weight: 5000,  options: { "Cantidad": "5 kg"  }, price: { crc: 55000,  usd: 104.99 }, stock: 80  },
      { title: "25 kg", sku: "FIBER-25", weight: 25000, options: { "Cantidad": "25 kg" }, price: { crc: 260000, usd: 499.99 }, stock: 30  },
    ],
  },

  // ── Construcción ─────────────────────────────────────────────────────────────
  {
    title: "Agramiza de Cáñamo (Hurd)",
    handle: "agramiza-canamo-hurd",
    description: "Núcleo leñoso del tallo de cáñamo, base para hempcrete y materiales de construcción sostenible. Alta absorción y bajo peso.",
    thumbnail: "https://picsum.photos/seed/ch-hurd-main/800/600",
    images: [
      "https://picsum.photos/seed/ch-hurd-1/800/600",
      "https://picsum.photos/seed/ch-hurd-2/800/600",
    ],
    status: "published" as const,
    category: "construccion",
    options: [{ title: "Presentación", values: ["20 kg (saco)", "200 kg (pallet)"] }],
    variants: [
      { title: "20 kg (saco)",    sku: "HURD-20",  weight: 20000,  options: { "Presentación": "20 kg (saco)"    }, price: { crc: 18000,  usd: 34.99  }, stock: 100 },
      { title: "200 kg (pallet)", sku: "HURD-200", weight: 200000, options: { "Presentación": "200 kg (pallet)" }, price: { crc: 160000, usd: 299.99 }, stock: 20  },
    ],
  },
]

// ─── Clientes de muestra ───────────────────────────────────────────────────────

const CUSTOMERS = [
  { email: "ana.vargas@example.com",      first_name: "Ana",     last_name: "Vargas",    phone: "+50688112233", company_name: null },
  { email: "carlos.ruiz@ejemplo.cr",      first_name: "Carlos",  last_name: "Ruiz",      phone: "+50671009988", company_name: "Tienda Naturista Verde Vida" },
  { email: "sofia.ureña@example.com",     first_name: "Sofía",   last_name: "Ureña",     phone: "+50683441122", company_name: null },
  { email: "distribuidora@hemptico.com",  first_name: "Miguel",  last_name: "Fonseca",   phone: "+50622998877", company_name: "Hemptico Distribuidora S.A." },
  { email: "juana.mora@gmail.com",        first_name: "Juana",   last_name: "Mora",      phone: "+50699001122", company_name: null },
  { email: "roberto.calvo@empresa.cr",    first_name: "Roberto", last_name: "Calvo",     phone: "+50677331144", company_name: "Calvo Construcciones Sostenibles" },
  { email: "maria.f.ureña@example.com",   first_name: "María F.", last_name: "Ureña",    phone: "+50655221100", company_name: null },
  { email: "tienda.verde@outlook.com",    first_name: "Diego",   last_name: "Jiménez",   phone: "+50688991234", company_name: "La Tienda Verde CR" },
]

// ─── Punto de entrada ──────────────────────────────────────────────────────────

export default async function seedCommerce({ container }: { container: MedusaContainer }) {
  console.log("\n🌿 Iniciando seed de comercio CoopeHemp...\n")

  const productModule    = container.resolve(Modules.PRODUCT)
  const pricingModule    = container.resolve(Modules.PRICING)
  const inventoryModule  = container.resolve(Modules.INVENTORY)
  const stockLocModule   = container.resolve(Modules.STOCK_LOCATION)
  const customerModule   = container.resolve(Modules.CUSTOMER)
  const promotionModule  = container.resolve(Modules.PROMOTION)
  const salesChModule    = container.resolve(Modules.SALES_CHANNEL)
  const regionModule     = container.resolve(Modules.REGION)
  const remoteLink       = container.resolve(ContainerRegistrationKeys.LINK)

  // ── 1. Sales Channel ────────────────────────────────────────────────────────
  console.log("🛒 Creando Sales Channel...")
  const [existingSC] = await salesChModule.listSalesChannels({ name: ["CoopeHemp Tienda Online"] })
  let salesChannel: any
  if (existingSC) {
    console.log("   ↳ Ya existe, usando el existente.")
    salesChannel = existingSC
  } else {
    ;[salesChannel] = await salesChModule.createSalesChannels([{
      name: "CoopeHemp Tienda Online",
      description: "Canal principal de ventas directas al consumidor",
      is_disabled: false,
    }])
    console.log(`   ✓ ${salesChannel.name}`)
  }

  // ── 2. Regions ──────────────────────────────────────────────────────────────
  console.log("\n🌎 Creando Regions...")
  const existingRegions = await regionModule.listRegions()
  if (existingRegions.length > 0) {
    console.log("   ↳ Ya existen regiones, saltando.")
  } else {
    const regions = await regionModule.createRegions([
      {
        name: "Centroamérica",
        currency_code: "crc",
        automatic_taxes: false,
        countries: ["cr", "gt", "hn", "sv", "ni", "pa", "bz"],
      },
      {
        name: "Internacional",
        currency_code: "usd",
        automatic_taxes: false,
        countries: ["us", "ca", "de", "nl", "es", "mx", "co"],
      },
    ])
    for (const r of regions) console.log(`   ✓ ${r.name} (${r.currency_code.toUpperCase()})`)
  }

  // ── 3. Categorías de producto ────────────────────────────────────────────────
  console.log("\n📂 Creando categorías...")
  const existingCats = await productModule.listProductCategories()
  const catMap: Record<string, string> = {}

  if (existingCats.length >= CATEGORIES.length) {
    console.log("   ↳ Ya existen categorías, construyendo mapa...")
    for (const c of existingCats) catMap[c.handle] = c.id
  } else {
    const cats = await productModule.createProductCategories(
      CATEGORIES.map((c) => ({ name: c.name, handle: c.handle, description: c.description, is_active: true, is_internal: false }))
    )
    for (const c of cats) {
      catMap[c.handle] = c.id
      console.log(`   ✓ ${c.name}`)
    }
  }

  // ── 4. Stock Location ────────────────────────────────────────────────────────
  console.log("\n📦 Creando Stock Location...")
  const existingLocs = await stockLocModule.listStockLocations()
  let stockLocation: any
  if (existingLocs.length > 0) {
    console.log("   ↳ Ya existe una ubicación, usando la primera.")
    stockLocation = existingLocs[0]
  } else {
    ;[stockLocation] = await stockLocModule.createStockLocations([{
      name: "Bodega Principal CoopeHemp — San José",
      address: {
        address_1: "Avenida Central, Barrio Escalante",
        city: "San José",
        country_code: "cr",
        postal_code: "10101",
      },
    }])
    console.log(`   ✓ ${stockLocation.name}`)
  }

  // ── 5. Productos, precios e inventario ───────────────────────────────────────
  console.log("\n🌱 Creando productos, precios e inventario...")

  const existingProducts = await productModule.listProducts()
  if (existingProducts.length > 0) {
    console.log("   ↳ Ya existen productos. Saltando creación de productos.")
  } else {
    for (const p of PRODUCTS) {
      const categoryId = catMap[p.category]

      // Crear producto
      const [product] = await productModule.createProducts([{
        title: p.title,
        handle: p.handle,
        description: p.description,
        thumbnail: p.thumbnail,
        images: p.images.map((url) => ({ url })),
        status: p.status,
        categories: categoryId ? [{ id: categoryId }] : [],
        options: p.options,
        variants: p.variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          manage_inventory: true,
          allow_backorder: false,
          weight: v.weight,
          options: v.options,
        })),
      }])

      console.log(`   ✓ ${product.title} (${product.variants?.length ?? 0} variantes)`)

      // Vincular el producto al sales channel — SIN esto la Store API no lo devuelve
      try {
        await remoteLink.create([{
          [Modules.PRODUCT]:       { product_id: product.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
        }])
      } catch (_) {
        // el link ya puede existir en re-ejecuciones
      }

      // Para cada variante: price set + inventory item
      for (const pVariant of (product.variants ?? [])) {
        const seedVariant = p.variants.find((v) => v.sku === pVariant.sku)
        if (!seedVariant) continue

        // Price set
        const [priceSet] = await pricingModule.createPriceSets([{
          prices: [
            { currency_code: "crc", amount: crc(seedVariant.price.crc) },
            { currency_code: "usd", amount: usd(seedVariant.price.usd) },
          ],
        }])

        // Link variant → price set
        try {
          await remoteLink.create([{
            [Modules.PRODUCT]:  { variant_id: pVariant.id },
            [Modules.PRICING]:  { price_set_id: priceSet.id },
          }])
        } catch (_) {
          // link may already exist on re-runs
        }

        // Inventory item
        const [invItem] = await inventoryModule.createInventoryItems([{
          sku: seedVariant.sku,
          title: `${product.title} — ${seedVariant.title}`,
          description: product.description,
          requires_shipping: true,
          weight: seedVariant.weight,
        }])

        // Inventory level (stock)
        await inventoryModule.createInventoryLevels([{
          inventory_item_id: invItem.id,
          location_id: stockLocation.id,
          stocked_quantity: seedVariant.stock,
          reserved_quantity: 0,
        }])

        // Link variant → inventory item
        try {
          await remoteLink.create([{
            [Modules.PRODUCT]:   { variant_id: pVariant.id },
            [Modules.INVENTORY]: { inventory_item_id: invItem.id },
          }])
        } catch (_) {
          // link may already exist
        }
      }
    }
  }

  // ── 5b. Actualizar imágenes en productos ya existentes ───────────────────────
  console.log("\n🖼  Sincronizando imágenes de productos...")
  const allProducts = await productModule.listProducts({}, { relations: ["images"] })
  let imagesUpdated = 0
  for (const product of allProducts) {
    const hasImages = product.images && product.images.length > 0
    if (!hasImages) {
      const seedProduct = PRODUCTS.find((p) => p.handle === product.handle)
      if (seedProduct) {
        await productModule.updateProducts([{
          id: product.id,
          thumbnail: seedProduct.thumbnail,
          images: seedProduct.images.map((url) => ({ url })),
        }])
        console.log(`   ✓ ${product.title} — ${seedProduct.images.length} imágenes`)
        imagesUpdated++
      }
    }
  }
  if (imagesUpdated === 0) console.log("   ↳ Todos los productos ya tienen imágenes.")

  // ── 6. Clientes ──────────────────────────────────────────────────────────────
  console.log("\n👥 Creando clientes...")
  const existingCustomers = await customerModule.listCustomers()
  if (existingCustomers.length > 0) {
    console.log(`   ↳ Ya existen ${existingCustomers.length} clientes, saltando.`)
  } else {
    const customers = await customerModule.createCustomers(
      CUSTOMERS.map((c) => ({
        email: c.email,
        first_name: c.first_name,
        last_name: c.last_name,
        phone: c.phone,
        ...(c.company_name ? { company_name: c.company_name } : {}),
        has_account: false,
      }))
    )
    for (const c of customers) console.log(`   ✓ ${c.first_name} ${c.last_name} <${c.email}>`)
  }

  // ── 7. Promociones ────────────────────────────────────────────────────────────
  console.log("\n🎁 Creando promociones...")
  const existingPromos = await promotionModule.listPromotions()
  if (existingPromos.length > 0) {
    console.log(`   ↳ Ya existen ${existingPromos.length} promociones, saltando.`)
  } else {
    const promos = await promotionModule.createPromotions([
      {
        code: "BIENVENIDO10",
        type: "standard",
        is_automatic: false,
        application_method: {
          type: "percentage",
          target_type: "order",
          allocation: "across",
          value: 10,
        },
      },
      {
        code: "HEMP20",
        type: "standard",
        is_automatic: false,
        application_method: {
          type: "percentage",
          target_type: "items",
          allocation: "across",
          value: 20,
        },
      },
    ])
    for (const p of promos) console.log(`   ✓ Código: ${p.code}`)
  }

  // ── 8. Price List mayorista (15 % off) ────────────────────────────────────────
  console.log("\n💼 Creando Price List Mayorista...")
  const existingPL = await pricingModule.listPriceLists({ title: ["Mayoristas CoopeHemp"] })
  if (existingPL.length > 0) {
    console.log("   ↳ Ya existe, saltando.")
  } else {
    const allPriceSets = await pricingModule.listPriceSets({}, { relations: ["prices"] })
    const wholesalePrices: { price_set_id: string; currency_code: string; amount: number }[] = []

    for (const ps of allPriceSets) {
      for (const price of (ps.prices ?? [])) {
        wholesalePrices.push({
          price_set_id: ps.id,
          currency_code: price.currency_code,
          amount: Math.round(price.amount * 0.85), // 15 % off
        })
      }
    }

    if (wholesalePrices.length > 0) {
      const now = new Date()
      const oneYearFromNow = new Date(now)
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

      await pricingModule.createPriceLists([{
        title: "Mayoristas CoopeHemp",
        description: "15 % de descuento para distribuidores y asociados de la cooperativa",
        type: "sale",
        status: "active",
        starts_at: now.toISOString(),
        ends_at: oneYearFromNow.toISOString(),
        prices: wholesalePrices,
      }])
      console.log(`   ✓ Price list creado con ${wholesalePrices.length} precios mayoristas.`)
    } else {
      console.log("   ⚠ No hay price sets aún para generar precios mayoristas.")
    }
  }

  console.log("\n✅ Seed de comercio completado con éxito.\n")
  console.log("═══════════════════════════════════════════")
  console.log("  Admin:  http://localhost:9000/app")
  console.log("  Login:  admin@coopehemp.cr / Admin1234!")
  console.log("  Códigos promo: BIENVENIDO10 | HEMP20")
  console.log("═══════════════════════════════════════════\n")
}
