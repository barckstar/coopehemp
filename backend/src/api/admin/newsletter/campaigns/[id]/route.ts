import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../../modules/newsletter/service"

// GET /admin/newsletter/campaigns/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService = req.scope.resolve(NEWSLETTER_MODULE)
  try {
    const campaign = await newsletterService.retrieveNewsletterCampaign(req.params.id)
    res.json({ campaign })
  } catch {
    res.status(404).json({ message: "Campaña no encontrada" })
  }
}

// PUT /admin/newsletter/campaigns/:id
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService = req.scope.resolve(NEWSLETTER_MODULE)

  let campaign: any
  try {
    campaign = await newsletterService.retrieveNewsletterCampaign(req.params.id)
  } catch {
    return res.status(404).json({ message: "Campaña no encontrada" })
  }

  if (campaign.status !== "draft") {
    return res.status(409).json({ message: "Solo las campañas en borrador pueden editarse" })
  }

  const { translations } = req.body as { translations: any[] }
  if (!translations) {
    return res.status(400).json({ message: "translations es requerido" })
  }

  const [updated] = await newsletterService.updateNewsletterCampaigns(
    { id: req.params.id },
    { translations }
  )
  res.json({ campaign: updated })
}

// DELETE /admin/newsletter/campaigns/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService = req.scope.resolve(NEWSLETTER_MODULE)

  try {
    const campaign = await newsletterService.retrieveNewsletterCampaign(req.params.id)
    if (campaign.status === "sending") {
      return res.status(409).json({ message: "No se puede eliminar una campaña en proceso de envío" })
    }
  } catch {
    return res.status(404).json({ message: "Campaña no encontrada" })
  }

  await newsletterService.deleteNewsletterCampaigns({ id: req.params.id })
  res.json({ id: req.params.id, deleted: true })
}
