import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../../modules/blog"
import type BlogModuleService from "../../../../modules/blog/service"

// GET /store/blog/:id?locale=es   (also works with slug via query: ?slug=slug-here)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const { id } = req.params
  const locale = (req.query.locale as string) || "es"

  // Support lookup by slug via query param  /store/blog/by-slug?slug=xxx
  let post
  if (id === "by-slug") {
    const slug = req.query.slug as string
    if (!slug) {
      return res.status(400).json({ message: "slug query param required" })
    }
    const [results] = await blogService.listAndCountBlogPosts(
      { slug, is_published: true },
      { take: 1 }
    )
    post = results[0]
  } else {
    post = await blogService.retrieveBlogPost(id)
  }

  if (!post || !post.is_published) {
    return res.status(404).json({ message: "Post not found" })
  }

  const translations = (post.translations as any[]) || []
  const t =
    translations.find((tr) => tr.locale === locale) ||
    translations.find((tr) => tr.locale === "es") ||
    translations[0] ||
    {}

  res.json({
    post: {
      id: post.id,
      slug: post.slug,
      cover_image: post.cover_image,
      gallery: (post.gallery as string[]) || [],
      category: post.category,
      author_name: post.author_name,
      published_at: post.published_at,
      title: t.title || "",
      excerpt: t.excerpt || "",
      content: t.content || "",
    },
  })
}
