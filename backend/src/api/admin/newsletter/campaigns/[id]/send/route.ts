import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../../../modules/newsletter/service"

// POST /admin/newsletter/campaigns/:id/send
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  try {
    const result = await newsletterService.sendCampaign(req.params.id)
    res.json({
      message: `Campaña enviada a ${result.sent} suscriptores`,
      sent: result.sent,
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Error al enviar campaña" })
  }
}
