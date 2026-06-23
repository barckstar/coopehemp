import { MedusaContainer } from "@medusajs/framework/types"
import { ApiKeyModuleService } from "@medusajs/api-key"
import { Modules } from "@medusajs/framework/utils"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

export default async function createPublishableKey({
  container,
}: {
  container: MedusaContainer
}) {
  const apiKeyService: ApiKeyModuleService = container.resolve("api_key")
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  // Sales channel de la tienda (el de seed-commerce) o el primero disponible.
  const channels = await salesChannelService.listSalesChannels()
  const channel =
    channels.find((c: any) => c.name === "CoopeHemp Tienda Online") ?? channels[0]

  // Reusar la key existente o crear una nueva.
  const [existing] = await apiKeyService.listAndCountApiKeys(
    { type: "publishable" },
    { take: 1 }
  )
  const key =
    existing.length > 0
      ? existing[0]
      : await apiKeyService.createApiKeys({
          title: "CoopeHemp Store",
          type: "publishable",
          created_by: "system-seed",
        })

  // Vincular la key al sales channel — SIN esto la Store API no devuelve productos
  // al frontend (devuelve 400 / lista vacía).
  if (channel) {
    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: { id: key.id, add: [channel.id] },
      })
      console.log(`   🔗 Key vinculada al canal "${channel.name}"`)
    } catch (e: any) {
      console.log(`   ⚠ No se pudo vincular (quizás ya estaba): ${e?.message ?? e}`)
    }
  } else {
    console.log("   ⚠ No hay sales channels — corré seed-commerce primero.")
  }

  console.log(`\n✅ Publishable key: ${key.token}\n`)
  console.log(`   Agrega esto al .env.local del frontend:`)
  console.log(`   VITE_MEDUSA_PUBLISHABLE_KEY=${key.token}\n`)
}
