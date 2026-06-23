/**
 * Reemplaza los thumbnails de picsum.photos (que redirigen) por URLs de
 * placehold.co que se sirven directamente sin redirect, funcionando en
 * cualquier red local.
 *
 * Ejecutar: npx ts-node -r tsconfig-paths/register src/scripts/fix-thumbnails.ts
 * O mejor:  NODE_ENV=development npx medusa exec src/scripts/fix-thumbnails.ts
 */

import { ExecArgs } from "@medusajs/framework/types"

const PRODUCT_IMAGES: Record<string, { thumbnail: string; images: string[] }> = {
  "Semillas de Cáñamo Peladas":       { thumbnail: "https://placehold.co/800x600/14532d/white?text=Semillas+Peladas",    images: ["https://placehold.co/800x600/166534/white?text=Semillas+1", "https://placehold.co/800x600/15803d/white?text=Semillas+2"] },
  "Harina de Cáñamo":                 { thumbnail: "https://placehold.co/800x600/14532d/white?text=Harina+de+Cáñamo",   images: ["https://placehold.co/800x600/166534/white?text=Harina+1",  "https://placehold.co/800x600/15803d/white?text=Harina+2"] },
  "Proteína de Cáñamo en Polvo":      { thumbnail: "https://placehold.co/800x600/14532d/white?text=Proteína+Cáñamo",    images: ["https://placehold.co/800x600/166534/white?text=Proteína+1"] },
  "Aceite de Semilla de Cáñamo":      { thumbnail: "https://placehold.co/800x600/14532d/white?text=Aceite+Semilla",     images: ["https://placehold.co/800x600/166534/white?text=Aceite+1",  "https://placehold.co/800x600/15803d/white?text=Aceite+2"] },
  "Aceite de CBD 500 mg":             { thumbnail: "https://placehold.co/800x600/14532d/white?text=CBD+500mg",          images: ["https://placehold.co/800x600/166534/white?text=CBD500+1",  "https://placehold.co/800x600/15803d/white?text=CBD500+2"] },
  "Aceite de CBD 1000 mg":            { thumbnail: "https://placehold.co/800x600/14532d/white?text=CBD+1000mg",         images: ["https://placehold.co/800x600/166534/white?text=CBD1000+1", "https://placehold.co/800x600/15803d/white?text=CBD1000+2"] },
  "Crema Facial Hidratante de Cáñamo":{ thumbnail: "https://placehold.co/800x600/14532d/white?text=Crema+Facial",       images: ["https://placehold.co/800x600/166534/white?text=Crema+1"] },
  "Bálsamo Muscular CBD":             { thumbnail: "https://placehold.co/800x600/14532d/white?text=Bálsamo+CBD",        images: ["https://placehold.co/800x600/166534/white?text=Bálsamo+1"] },
  "Fibra Bast de Cáñamo (Mayoreo)":   { thumbnail: "https://placehold.co/800x600/14532d/white?text=Fibra+Bast",         images: ["https://placehold.co/800x600/166534/white?text=Fibra+1",  "https://placehold.co/800x600/15803d/white?text=Fibra+2"] },
  "Agramiza de Cáñamo (Hurd)":        { thumbnail: "https://placehold.co/800x600/14532d/white?text=Agramiza+Hurd",      images: ["https://placehold.co/800x600/166534/white?text=Hurd+1",   "https://placehold.co/800x600/15803d/white?text=Hurd+2"] },
}

export default async function fixThumbnails({ container }: ExecArgs) {
  const productService = container.resolve("product")

  const products = await productService.listProducts({}, { take: 50 })
  let updated = 0

  for (const product of products) {
    const imgData = PRODUCT_IMAGES[product.title]
    if (!imgData) { console.log(`⚠ No hay datos para: ${product.title}`); continue }

    await productService.updateProducts(product.id, {
      thumbnail: imgData.thumbnail,
      images: imgData.images.map(url => ({ url })),
    })

    console.log(`✓ Actualizado: ${product.title}`)
    updated++
  }

  console.log(`\n✅ ${updated} productos actualizados con imágenes de placehold.co`)
}
