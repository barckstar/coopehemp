/**
 * setup-store.ts
 * Run: npx medusa exec ./src/scripts/setup-store.ts
 */
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export default async function setupStore({ container }: { container: MedusaContainer }) {
  console.log("\n🔧 Configurando tienda CoopeHemp...\n")

  const query   = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModule = container.resolve("fulfillment") as any
  const regionModule      = container.resolve("region") as any
  const salesChModule     = container.resolve("sales_channel") as any

  // ── Fetch base entities ────────────────────────────────────────────────────
  const { data: regions } = await query.graph({ entity: "region", fields: ["id","name","currency_code"] })
  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id","name"] })
  const { data: products } = await query.graph({ entity: "product", fields: ["id","title"], filters: { status: "published" } })
  const { data: shippingProfiles } = await query.graph({ entity: "shipping_profile", fields: ["id","name"] })

  const defaultSC = salesChannels.find((s: any) => s.name === "Default Sales Channel")!
  const regionCRC = regions.find((r: any) => r.currency_code === "crc")!
  const regionUSD = regions.find((r: any) => r.currency_code === "usd")!
  const profile   = shippingProfiles[0]

  console.log(`Sales channel : ${defaultSC.name}`)
  console.log(`Region CRC   : ${regionCRC.name}`)
  console.log(`Region USD   : ${regionUSD.name}`)
  console.log(`Productos    : ${products.length}`)
  console.log(`Shipping profile: ${profile.name}\n`)

  // ── 1. Link products → Default Sales Channel ───────────────────────────────
  console.log("📦 Vinculando productos al sales channel...")
  try {
    // Medusa v2 uses module service method
    const scService = container.resolve("sales_channel") as any
    await scService.addProducts(defaultSC.id, products.map((p: any) => ({ id: p.id })))
    console.log(`   ✓ ${products.length} productos vinculados`)
  } catch (e: any) {
    // Try alternative method name
    try {
      await salesChModule.upsertSalesChannels?.([])
      console.log("   ⚠ método no disponible vía script — vincular manualmente en admin")
    } catch {
      console.log(`   ⚠ vincular en admin > Sales Channels > ${defaultSC.name} > Products`)
    }
  }

  // ── 2. Payment provider → regions ─────────────────────────────────────────
  console.log("\n💳 Vinculando pp_system_default a regiones...")
  for (const region of regions) {
    try {
      await regionModule.updateRegions(region.id, {
        payment_providers: [{ id: "pp_system_default" }],
      })
      console.log(`   ✓ ${region.name}`)
    } catch (e: any) {
      console.log(`   ⚠ ${region.name}: ${e.message?.slice(0, 80)}`)
    }
  }

  // ── 3. Fulfillment set + service zones + shipping options ──────────────────
  console.log("\n🚚 Configurando envío...")

  const { data: existingFSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id","name","type"],
  }).catch(() => ({ data: [] }))

  const shippingData = [
    {
      fsName: "CoopeHemp — Envío Nacional",
      fsType: "shipping",
      zoneName: "Centroamérica",
      optionName: "Envío Nacional (3–5 días hábiles)",
      optionCode: "nacional-std",
      amount: 350000,  // ₡3,500 (Medusa stores prices in minor units × 100)
      currency: "crc",
      regionId: regionCRC.id,
      countries: ["cr"],
    },
    {
      fsName: "CoopeHemp — Envío Express",
      fsType: "shipping",
      zoneName: "GAM Express",
      optionName: "Envío Exprés GAM (1–2 días hábiles)",
      optionCode: "gam-express",
      amount: 700000,  // ₡7,000
      currency: "crc",
      regionId: regionCRC.id,
      countries: ["cr"],
    },
    {
      fsName: "CoopeHemp — International",
      fsType: "shipping",
      zoneName: "International",
      optionName: "International Shipping (7–14 business days)",
      optionCode: "international-std",
      amount: 2500,    // $25.00
      currency: "usd",
      regionId: regionUSD.id,
      countries: ["us", "ca", "de", "nl", "es", "mx", "co"],
    },
  ]

  for (const cfg of shippingData) {
    try {
      // Check if shipping option already exists
      const existing = await fulfillmentModule.listShippingOptions({ name: cfg.optionName })
      if (existing?.length > 0) {
        console.log(`   ⏭  "${cfg.optionName}" ya existe`)
        continue
      }

      // Create fulfillment set
      let fSet = existingFSets?.find((f: any) => f.name === cfg.fsName)
      if (!fSet) {
        fSet = await fulfillmentModule.createFulfillmentSets({
          name: cfg.fsName,
          type: cfg.fsType,
        })
      }

      // Create service zone
      const [existingZone] = await fulfillmentModule.listServiceZones({ name: cfg.zoneName }).catch(() => [])
      let zone = existingZone
      if (!zone) {
        zone = await fulfillmentModule.createServiceZones({
          name: cfg.zoneName,
          fulfillment_set_id: fSet.id,
          geo_zones: cfg.countries.map((c) => ({ type: "country" as const, country_code: c })),
        })
      }

      // Create shipping option
      await fulfillmentModule.createShippingOptions({
        name: cfg.optionName,
        service_zone_id: zone.id,
        shipping_profile_id: profile.id,
        fulfillment_provider_id: "manual",
        type: { label: cfg.optionName, description: "", code: cfg.optionCode },
        data: {},
        price_type: "flat",
        prices: [{ amount: cfg.amount, currency_code: cfg.currency, region_id: cfg.regionId }],
      })

      console.log(`   ✓ "${cfg.optionName}" — ${cfg.currency === "crc" ? `₡${cfg.amount/100}` : `$${cfg.amount/100}`}`)
    } catch (e: any) {
      console.log(`   ⚠ ${cfg.optionName}: ${e.message?.slice(0, 120)}`)
    }
  }

  // ── 4. Summary ─────────────────────────────────────────────────────────────
  const { data: finalOptions } = await query.graph({ entity: "shipping_option", fields: ["id","name"] }).catch(() => ({ data: [] }))
  console.log(`\n✅ Setup completado. Shipping options activas: ${finalOptions.length}`)

  console.log("\n── Para activar pagos reales (cuando esté listo): ─────────────────────")
  console.log("  STRIPE:")
  console.log("    1. npm install @medusajs/payment-stripe  (en Back-End)")
  console.log("    2. En medusa-config.ts, agregar a modules[]:")
  console.log('         { resolve: "@medusajs/payment-stripe", options: { apiKey: process.env.STRIPE_SECRET_KEY } }')
  console.log("    3. En .env: STRIPE_SECRET_KEY=sk_...  STRIPE_WEBHOOK_SECRET=whsec_...")
  console.log("    4. En Medusa Admin > Settings > Regions > agregar Stripe a la región")
  console.log("  PAYPAL:")
  console.log("    1. npm install @medusajs/payment-paypal")
  console.log("    2. Similar configuración en medusa-config.ts\n")
}
