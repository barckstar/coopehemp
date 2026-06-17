// In dev: VITE_MEDUSA_URL=http://localhost:9000 (direct, CORS allowed) or empty (Vite proxy)
// In production: set VITE_MEDUSA_URL to the deployed API URL
const MEDUSA_URL = ((import.meta.env.VITE_MEDUSA_URL as string) || '').replace(/\/$/, '')
const PUB_KEY   = (import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY as string) || ''

export async function storeFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${MEDUSA_URL}/store${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(PUB_KEY ? { 'x-publishable-api-key': PUB_KEY } : {}),
      ...options?.headers,
    },
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || `API error ${res.status}`)
  }
  return data as T
}
