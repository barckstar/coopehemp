import { model } from "@medusajs/framework/utils"

export type CampaignTranslation = {
  locale: string
  subject: string
  body_html: string
}

export type CampaignStatus = "draft" | "sending" | "sent" | "failed"

const NewsletterCampaign = model.define("newsletter_campaign", {
  id: model.id().primaryKey(),
  status: model.text().default("draft"),
  sent_at: model.dateTime().nullable(),
  recipient_count: model.number().default(0),
  // [{locale, subject, body_html}] — one entry per language
  translations: model.json().default([] as any),
})

export default NewsletterCampaign
