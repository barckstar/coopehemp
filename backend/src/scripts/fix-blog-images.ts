/**
 * Reemplaza cover_image de los blog posts (picsum → placehold.co)
 * Ejecutar: npx medusa exec src/scripts/fix-blog-images.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { BLOG_MODULE } from "../modules/blog"

const COLORS = ["14532d", "166534", "15803d", "16a34a", "1a7a40"]

export default async function fixBlogImages({ container }: ExecArgs) {
  const blogService = container.resolve(BLOG_MODULE)

  const [posts] = await blogService.listAndCountBlogPosts({}, { take: 50 })
  let updated = 0

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const color = COLORS[i % COLORS.length]
    const label = encodeURIComponent(post.slug.replace(/-/g, "+").slice(0, 20))
    const cover = `https://placehold.co/800x600/${color}/white?text=${label}`

    await blogService.updateBlogPosts({ id: post.id }, { cover_image: cover })
    console.log(`✓ ${post.slug}`)
    updated++
  }

  console.log(`\n✅ ${updated} posts actualizados`)
}
