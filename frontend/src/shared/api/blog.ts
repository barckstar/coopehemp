import { storeFetch } from './client'

export interface BlogPostSummary {
  id: string
  slug: string
  cover_image: string | null
  category: string
  author_name: string
  published_at: string | null
  title: string
  excerpt: string
}

export interface BlogPostFull extends BlogPostSummary {
  content: string
}

export interface BlogListResponse {
  posts: BlogPostSummary[]
  count: number
  page: number
  limit: number
}

export interface BlogPostResponse {
  post: BlogPostFull
}

export async function listBlogPosts(params: {
  locale?: string
  category?: string
  page?: number
  limit?: number
}): Promise<BlogListResponse> {
  const q = new URLSearchParams()
  if (params.locale) q.set('locale', params.locale)
  if (params.category) q.set('category', params.category)
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  return storeFetch<BlogListResponse>(`/blog?${q.toString()}`)
}

export async function getBlogPost(idOrSlug: string, locale = 'es'): Promise<BlogPostFull> {
  const q = new URLSearchParams({ locale })
  // Support slug lookups
  if (!idOrSlug.startsWith('01')) {
    q.set('slug', idOrSlug)
    const { post } = await storeFetch<BlogPostResponse>(`/blog/by-slug?${q.toString()}`)
    return post
  }
  const { post } = await storeFetch<BlogPostResponse>(`/blog/${idOrSlug}?${q.toString()}`)
  return post
}
