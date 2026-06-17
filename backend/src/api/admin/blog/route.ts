import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../modules/blog"
import type BlogModuleService from "../../../modules/blog/service"

// GET /admin/blog?page=1&limit=20&is_published=true
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const page = parseInt((req.query.page as string) || "1")
  const limit = parseInt((req.query.limit as string) || "20")
  const filters: Record<string, unknown> = {}
  if (req.query.is_published !== undefined) {
    filters.is_published = req.query.is_published === "true"
  }

  const [posts, count] = await blogService.listAndCountBlogPosts(filters, {
    skip: (page - 1) * limit,
    take: limit,
    order: { created_at: "DESC" },
  })

  res.json({ posts, count, page, limit })
}

// POST /admin/blog
// Body: { slug, cover_image?, category, author_name, is_published?, translations }
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const body = req.body as any

  if (!body.slug || !body.category || !body.author_name) {
    return res
      .status(400)
      .json({ message: "slug, category y author_name son requeridos" })
  }

  if (!body.translations || !Array.isArray(body.translations) || body.translations.length === 0) {
    return res
      .status(400)
      .json({ message: "Debes incluir al menos una traducción" })
  }

  const post = await blogService.createBlogPosts({
    slug: body.slug,
    cover_image: body.cover_image || null,
    gallery: Array.isArray(body.gallery) ? body.gallery.filter(Boolean) : [],
    category: body.category,
    author_name: body.author_name,
    is_published: body.is_published || false,
    published_at: body.is_published ? new Date() : null,
    translations: body.translations,
  })

  res.status(201).json({ post })
}
