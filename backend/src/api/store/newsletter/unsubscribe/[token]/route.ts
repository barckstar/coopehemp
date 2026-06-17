import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../../modules/newsletter/service"

// GET /store/newsletter/unsubscribe/:token
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const { token } = req.params

  const [found] = await newsletterService.listAndCountNewsletterSubscribers(
    { unsubscribe_token: token },
    { take: 1 }
  )

  if (found.length === 0) {
    return res.status(404).json({ message: "Token de baja inválido o expirado" })
  }

  await newsletterService.updateNewsletterSubscribers(
    { id: found[0].id },
    { is_active: false }
  )

  res.json({ message: "Te has dado de baja del boletín exitosamente" })
}
