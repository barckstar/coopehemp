import { MedusaContainer } from "@medusajs/framework/types"
import { ApiKeyModuleService } from "@medusajs/api-key"

export default async function createPublishableKey({
  container,
}: {
  container: MedusaContainer
}) {
  const apiKeyService: ApiKeyModuleService = container.resolve("api_key")

  // Check if a store publishable key already exists
  const [existing] = await apiKeyService.listAndCountApiKeys(
    { type: "publishable" },
    { take: 1 }
  )

  if (existing.length > 0) {
    console.log(`\n✅ Publishable key ya existe: ${existing[0].token}\n`)
    console.log(`   Agrega esto a Front-End/coopehemp/.env.local:`)
    console.log(`   VITE_MEDUSA_PUBLISHABLE_KEY=${existing[0].token}\n`)
    return
  }

  const key = await apiKeyService.createApiKeys({
    title: "CoopeHemp Store",
    type: "publishable",
    created_by: "system-seed",
  })

  console.log(`\n✅ Publishable key creada: ${key.token}\n`)
  console.log(`   Agrega esto a Front-End/coopehemp/.env.local:`)
  console.log(`   VITE_MEDUSA_PUBLISHABLE_KEY=${key.token}\n`)
}
