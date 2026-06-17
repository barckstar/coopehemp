import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../modules/newsletter/service"

// GET /admin/newsletter/subscribers?page=1&limit=50&is_active=true
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const page = parseInt((req.query.page as string) || "1")
  const limit = parseInt((req.query.limit as string) || "50")
  const filters: Record<string, unknown> = {}
  if (req.query.is_active !== undefined) {
    filters.is_active = req.query.is_active === "true"
  }

  const [subscribers, count] =
    await newsletterService.listAndCountNewsletterSubscribers(filters, {
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: "DESC" },
    })

  // Never expose the unsubscribe_token in admin list
  const data = subscribers.map(({ unsubscribe_token: _, ...s }) => s)

  res.json({ subscribers: data, count, page, limit })
}

// DELETE /admin/newsletter/subscribers  (body: { id })
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const { id } = req.body as { id: string }
  if (!id) return res.status(400).json({ message: "id requerido" })

  await newsletterService.deleteNewsletterSubscribers({ id })
  res.json({ id, deleted: true })
}
