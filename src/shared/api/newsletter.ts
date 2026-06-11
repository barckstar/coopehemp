import { storeFetch } from './client'

export async function subscribeNewsletter(email: string, locale = 'es'): Promise<{ message: string }> {
  return storeFetch<{ message: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, locale }),
  })
}
