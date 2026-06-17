import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkSC({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "sales_channels.id", "sales_channels.name", "variants.id"],
  })

  console.log(`\nSales Channels (${salesChannels.length}):`)
  for (const sc of salesChannels as any[]) {
    console.log(`  [${sc.id}] ${sc.name}`)
  }

  console.log(`\nProductos (${products.length}):`)
  for (const p of products as any[]) {
    const channels = (p.sales_channels || []).map((sc: any) => sc.name).join(", ") || "(sin canal)"
    console.log(`  ${p.title} | ${p.status} | canales: ${channels} | variants: ${(p.variants||[]).length}`)
  }
}
