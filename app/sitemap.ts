import { MetadataRoute } from "next"
import { getProductsWithVariantsFromDB, getAllCategories } from "@/db/actions"
import { slugify } from "@/lib/slugify"
import { getAllPosts } from "@/lib/blog-data"

const BASE_URL = "https://fabricadepeluchesmundodisney.com"

const STATIC_ROUTES: MetadataRoute.Sitemap[0][] = [
  { url: BASE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/peluches`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/cojines`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/cervicales`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/llaveros`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/latas`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/ropa`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/floristeria`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/empresas`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/contacto`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/tienda`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/ofertas`, changeFrequency: "daily", priority: 0.7 },
  { url: `${BASE_URL}/cucuta`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/rubio`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/san-antonio-del-tachira`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [...STATIC_ROUTES]

  try {
    const [categories, products, posts] = await Promise.all([
      getAllCategories(),
      getProductsWithVariantsFromDB(),
      getAllPosts(),
    ])

    for (const category of categories) {
      sitemap.push({
        url: `${BASE_URL}/${category.slug}`,
        changeFrequency: "daily",
        priority: 0.9,
      })
    }

    const seenProducts = new Set<string>()
    for (const product of products) {
      if (!product.category || !product.name) continue

      const categorySlug = product.category.toLowerCase()
      const productSlug = slugify(product.name)
      const url = `${BASE_URL}/${categorySlug}/${productSlug}`

      if (seenProducts.has(url)) continue
      seenProducts.add(url)

      sitemap.push({
        url,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }

    for (const post of posts) {
      sitemap.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error("Error generating sitemap:", error)
  }

  return sitemap
}
