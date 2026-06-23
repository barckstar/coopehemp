import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NEWSLETTER_MODULE } from "../../../../modules/newsletter"
import type NewsletterModuleService from "../../../../modules/newsletter/service"

// GET /admin/newsletter/campaigns
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const page = parseInt((req.query.page as string) || "1")
  const limit = parseInt((req.query.limit as string) || "20")

  const [campaigns, count] =
    await newsletterService.listAndCountNewsletterCampaigns(
      {},
      {
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: "DESC" },
      }
    )

  res.json({ campaigns, count, page, limit })
}

// POST /admin/newsletter/campaigns
// Body: { translations: [{locale, subject, body_html}] }
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService =
    req.scope.resolve(NEWSLETTER_MODULE)

  const { translations } = req.body as { translations: any[] }

  if (!translations || !Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({
      message: "Debes incluir al menos una traducción con locale, subject y body_html",
    })
  }

  for (const t of translations) {
    if (!t.locale || !t.subject || !t.body_html) {
      return res.status(400).json({
        message: "Cada traducción necesita locale, subject y body_html",
      })
    }
  }

  const campaign = await newsletterService.createNewsletterCampaigns({
    translations: translations as any,
    status: "draft",
    recipient_count: 0,
  })

  res.status(201).json({ campaign })
}
