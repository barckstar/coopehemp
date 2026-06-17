import { model } from "@medusajs/framework/utils"

const NewsletterSubscriber = model.define("newsletter_subscriber", {
  id: model.id().primaryKey(),
  email: model.text(),
  locale: model.text().default("es"),
  is_active: model.boolean().default(true),
  unsubscribe_token: model.text(),
})

export default NewsletterSubscriber
