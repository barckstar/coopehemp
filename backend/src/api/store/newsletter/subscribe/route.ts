import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../modules/newsletter/service"

// POST /store/newsletter/subscribe
// Body: { email: string, locale?: string }
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const { email, locale = "es" } = req.body as {
    email: string
    locale?: string
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Correo electrónico inválido" })
  }

  // Check if already subscribed
  const [existing] = await newsletterService.listAndCountNewsletterSubscribers(
    { email },
    { take: 1 }
  )

  if (existing.length > 0) {
    const subscriber = existing[0]
    if (subscriber.is_active) {
      return res
        .status(409)
        .json({ message: "Este correo ya está suscrito al boletín" })
    }
    // Re-activate
    await newsletterService.updateNewsletterSubscribers(
      { id: subscriber.id },
      { is_active: true, locale }
    )
    return res.json({ message: "Suscripción reactivada con éxito" })
  }

  const token = newsletterService.generateUnsubscribeToken()

  await newsletterService.createNewsletterSubscribers({
    email,
    locale,
    is_active: true,
    unsubscribe_token: token,
  })

  res.status(201).json({ message: "¡Suscripción exitosa!" })
}
