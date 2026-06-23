import { model } from "@medusajs/framework/utils"

export type BlogTranslation = {
  locale: string
  title: string
  excerpt: string
  content: string
}

const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  slug: model.text(),
  cover_image: model.text().nullable(),
  // Additional images: array of URLs, max 8 recommended
  gallery: model.json().default([] as any),
  category: model.text(),
  author_name: model.text(),
  is_published: model.boolean().default(false),
  published_at: model.dateTime().nullable(),
  // [{locale, title, excerpt, content}] — content stored as Markdown
  translations: model.json().default([] as any),
})

export default BlogPost
