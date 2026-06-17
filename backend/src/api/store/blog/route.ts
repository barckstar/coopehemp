import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../modules/blog"
import type BlogModuleService from "../../../modules/blog/service"

// GET /store/blog?locale=es&category=Comunidad&page=1&limit=9
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const locale = (req.query.locale as string) || "es"
  const category = req.query.category as string | undefined
  const page = parseInt((req.query.page as string) || "1")
  const limit = parseInt((req.query.limit as string) || "9")

  const filters: Record<string, unknown> = { is_published: true }
  if (category) filters.category = category

  const [posts, count] = await blogService.listAndCountBlogPosts(filters, {
    skip: (page - 1) * limit,
    take: limit,
    order: { published_at: "DESC" },
  })

  // Return only the requested locale translation per post
  const data = posts.map((post) => {
    const translations = (post.translations as any[]) || []
    const t =
      translations.find((tr) => tr.locale === locale) ||
      translations.find((tr) => tr.locale === "es") ||
      translations[0] ||
      {}

    return {
      id: post.id,
      slug: post.slug,
      cover_image: post.cover_image,
      gallery: (post.gallery as string[]) || [],
      category: post.category,
      author_name: post.author_name,
      published_at: post.published_at,
      title: t.title || "",
      excerpt: t.excerpt || "",
    }
  })

  res.json({ posts: data, count, page, limit })
}
