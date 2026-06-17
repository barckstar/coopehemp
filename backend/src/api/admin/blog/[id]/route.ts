import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../../modules/blog"
import type BlogModuleService from "../../../../modules/blog/service"

// GET /admin/blog/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  try {
    const post = await blogService.retrieveBlogPost(req.params.id)
    res.json({ post })
  } catch {
    res.status(404).json({ message: "Post no encontrado" })
  }
}

// PUT /admin/blog/:id
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const body = req.body as any

  const updateData: Record<string, unknown> = {}
  if (body.slug !== undefined) updateData.slug = body.slug
  if (body.cover_image !== undefined) updateData.cover_image = body.cover_image
  if (body.gallery !== undefined) updateData.gallery = Array.isArray(body.gallery) ? body.gallery.filter(Boolean) : []
  if (body.category !== undefined) updateData.category = body.category
  if (body.author_name !== undefined) updateData.author_name = body.author_name
  if (body.translations !== undefined) updateData.translations = body.translations

  if (body.is_published !== undefined) {
    updateData.is_published = body.is_published
    if (body.is_published && !body.published_at) {
      updateData.published_at = new Date()
    }
  }

  try {
    const [post] = await blogService.updateBlogPosts({ id: req.params.id }, updateData)
    res.json({ post })
  } catch {
    res.status(404).json({ message: "Post no encontrado" })
  }
}

// DELETE /admin/blog/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  await blogService.deleteBlogPosts({ id: req.params.id })
  res.json({ id: req.params.id, deleted: true })
}
