import { storeFetch } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MedusaAddress {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code?: string
  country_code: string
  phone?: string
}

export interface MedusaLineItem {
  id: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  variant_id: string
  quantity: number
  unit_price: number
  total: number
  currency_code: string
}

export interface MedusaShippingMethod {
  id: string
  name: string
  total: number
}

export interface MedusaCart {
  id: string
  email: string | null
  currency_code: string
  items: MedusaLineItem[]
  region_id: string | null
  shipping_address: MedusaAddress | null
  billing_address: MedusaAddress | null
  shipping_methods: MedusaShippingMethod[]
  payment_collection: { id: string; payment_sessions: { id: string; provider_id: string; status: string; data: Record<string, unknown> }[] } | null
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
}

export interface MedusaShippingOption {
  id: string
  name: string
  amount: number
  currency_code: string
}

export interface MedusaProduct {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  handle: string
  variants: MedusaVariant[]
  collection_id: string | null
  tags: { value: string }[]
}

export interface MedusaVariant {
  id: string
  title: string
  sku: string | null
  calculated_price: { calculated_amount: number; currency_code: string } | null
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  limit?: number
  offset?: number
  region_id?: string
  currency_code?: string
}): Promise<{ products: MedusaProduct[]; count: number }> {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  if (params?.region_id) q.set('region_id', params.region_id)
  if (params?.currency_code) q.set('currency_code', params.currency_code)
  q.set('fields', 'id,title,description,thumbnail,handle,variants.*,variants.calculated_price')
  return storeFetch(`/products?${q.toString()}`)
}

// ─── Regions ──────────────────────────────────────────────────────────────────

export async function getRegions(): Promise<{ regions: { id: string; name: string; currency_code: string; countries: { iso_2: string }[] }[] }> {
  return storeFetch('/regions')
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(params: { region_id: string; email?: string }): Promise<{ cart: MedusaCart }> {
  return storeFetch('/carts', { method: 'POST', body: JSON.stringify(params) })
}

export async function getCart(cartId: string): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}`)
}

export async function addLineItem(cartId: string, variantId: string, quantity = 1): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

export async function removeLineItem(cartId: string, lineItemId: string): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}/line-items/${lineItemId}`, { method: 'DELETE' })
}

export async function updateCart(cartId: string, data: Partial<{
  email: string
  billing_address: MedusaAddress
  shipping_address: MedusaAddress
  region_id: string
}>): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}`, { method: 'PUT', body: JSON.stringify(data) })
}

// ─── Shipping ──────────────────────────────────────────────────────────────────

export async function getShippingOptions(cartId: string): Promise<{ shipping_options: MedusaShippingOption[] }> {
  return storeFetch(`/shipping-options?cart_id=${cartId}`)
}

export async function addShippingMethod(cartId: string, optionId: string): Promise<{ cart: MedusaCart }> {
  return storeFetch(`/carts/${cartId}/shipping-methods`, {
    method: 'POST',
    body: JSON.stringify({ option_id: optionId }),
  })
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export async function initiatePaymentSession(cartId: string, providerId: string): Promise<{ payment_collection: MedusaCart['payment_collection'] }> {
  // Step 1 — create or get payment collection
  const { payment_collection } = await storeFetch<{ payment_collection: { id: string } }>(
    '/payment-collections',
    { method: 'POST', body: JSON.stringify({ cart_id: cartId }) }
  )
  // Step 2 — initialize a payment session for the chosen provider
  return storeFetch(`/payment-collections/${payment_collection.id}/payment-sessions`, {
    method: 'POST',
    body: JSON.stringify({ provider_id: providerId }),
  })
}

export async function completeCart(cartId: string): Promise<{ type: 'order'; order: { id: string; display_id: number; email: string; total: number; currency_code: string } }> {
  return storeFetch(`/carts/${cartId}/complete`, { method: 'POST' })
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrder(orderId: string): Promise<{ order: { id: string; display_id: number; email: string; total: number; currency_code: string; items: MedusaLineItem[] } }> {
  return storeFetch(`/orders/${orderId}`)
}
