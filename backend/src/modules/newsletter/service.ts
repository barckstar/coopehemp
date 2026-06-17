import { MedusaService } from "@medusajs/framework/utils"
import nodemailer from "nodemailer"
import crypto from "crypto"
import NewsletterSubscriber from "./models/newsletter-subscriber"
import NewsletterCampaign from "./models/newsletter-campaign"
import type { CampaignTranslation } from "./models/newsletter-campaign"

class NewsletterModuleService extends MedusaService({
  NewsletterSubscriber,
  NewsletterCampaign,
}) {
  private createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "1025"),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    })
  }

  generateUnsubscribeToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  async sendCampaign(campaignId: string): Promise<{ sent: number }> {
    const campaign = await this.retrieveNewsletterCampaign(campaignId)

    if (campaign.status !== "draft") {
      throw new Error(
        `Campaign ${campaignId} is not in draft status (current: ${campaign.status})`
      )
    }

    const translations = campaign.translations as CampaignTranslation[]
    if (!translations || translations.length === 0) {
      throw new Error("Campaign has no translations — add at least one locale")
    }

    const fallbackTranslation =
      translations.find((t) => t.locale === "es") || translations[0]

    await this.updateNewsletterCampaigns(
      { id: campaignId },
      { status: "sending" }
    )

    const [subscribers] = await this.listAndCountNewsletterSubscribers({
      is_active: true,
    })

    const transporter = this.createTransporter()
    const from = process.env.SMTP_FROM || "noreply@coopehemp.cr"
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

    let sent = 0

    for (const subscriber of subscribers) {
      const translation =
        translations.find((t) => t.locale === subscriber.locale) ||
        fallbackTranslation

      const unsubscribeUrl = `${frontendUrl}/newsletter/unsubscribe/${subscriber.unsubscribe_token}`

      const bodyHtml = translation.body_html
        .replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl)
        .replace(/\{\{email\}\}/g, subscriber.email)
        .replace(/\{\{locale\}\}/g, subscriber.locale)

      try {
        await transporter.sendMail({
          from,
          to: subscriber.email,
          subject: translation.subject,
          html: bodyHtml,
        })
        sent++
      } catch {
        // log and continue so one bad address doesn't abort the whole campaign
        console.error(`Failed to send to ${subscriber.email}`)
      }
    }

    await this.updateNewsletterCampaigns(
      { id: campaignId },
      { status: "sent", sent_at: new Date(), recipient_count: sent }
    )

    return { sent }
  }
}

export default NewsletterModuleService
