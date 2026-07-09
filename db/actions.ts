"use server"

import { randomBytes } from "crypto"
import { Buffer } from "buffer"
import { cookies, headers } from "next/headers"
import { unstable_cache, revalidateTag } from "next/cache"
import { turso } from "@/db"

const SESSION_COOKIE = "admin_session"

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = (await cookies()) as any
  const session = cookieStore.get?.(SESSION_COOKIE) || cookieStore.getAll?.()?.find((c: any) => c.name === SESSION_COOKIE)
  if (!session?.value) return false
  try {
    const result = await turso.execute({
      sql: `SELECT id FROM admin_users WHERE id = ? AND active = 1`,
      args: [session.value]
    })
    return (result as any).rows.length > 0
  } catch {
    return false
  }
}

async function requireAdmin(): Promise<boolean> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado")
  }
  return true
}

const LATIN_NAMES = [
  "Ana García", "Luis Martínez", "María López", "Carlos Rodríguez", "Sofía Hernández",
  "Miguel Sánchez", "Elena Fernández", "José Torres", "Laura Jiménez", "David Ramírez",
  "Isabel Morales", "Antonio Ortiz", "Patricia Ruiz", "Jorge Castro", "Marta Vásquez",
  "Francisco Ríos", "Carmen Silva", "Juan Vargas", "Rosa Méndez", "Diego Aguirre",
  "Lucía Romero", "Roberto Navarro", "Silvia Delgado", "Fernando Herrera", "Claudia Campos"
]

const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const LOGIN_RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const LOGIN_RATE_LIMIT_MAX = 5 // 5 intentos por minuto

function checkLoginRateLimit(identifier: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now })
    return true
  }

  if (now - attempt.firstAttempt > LOGIN_RATE_LIMIT_WINDOW) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now })
    return true
  }

  if (attempt.count >= LOGIN_RATE_LIMIT_MAX) {
    return false
  }

  attempt.count++
  return true
}

async function getCategories() {

  const result = await turso.execute({
    sql: `SELECT id, name, slug FROM categories ORDER BY id`,
  })

  return (result as any).rows
}

const getCategoriesCached = unstable_cache(
  getCategories,
  ["categories"],
  { revalidate: 3600, tags: ["products"] }
)

async function _loadProductsWithStock() {

  const result = await turso.execute({
    sql: `SELECT id, name, stock, price, wholesale_price, original_price, is_new, is_sale, image, category_id, badge, badge_color, min_wholesale, of_price, of_wholesale_price, of_original_price, of_stock, of_badge, of_badge_color, of_active FROM products ORDER BY name`,
  })

  return (result as any).rows
}

const getProductsWithStockCached = unstable_cache(
  _loadProductsWithStock,
  ["products-with-stock"],
  { revalidate: 3600, tags: ["products"] }
)

export async function getProductsWithStock(): Promise<Array<{ 
  id: number, 
  name: string, 
  stock: number,
  price: number,
  wholesale_price: number,
  image: string,
  category_id: number,
  original_price?: number,
  is_new?: boolean,
  is_sale?: boolean,
  badge?: string,
  badge_color?: string,
  min_wholesale?: number,
  of_price?: number,
  of_wholesale_price?: number,
  of_original_price?: number,
  of_stock?: number,
  of_badge?: string,
  of_badge_color?: string,
  of_active?: number
}>> {
  return getProductsWithStockCached()
}

async function getVariants() {

  const result = await turso.execute({
    sql: `SELECT id, product_id, label, price, wholesale_price, stock, variant_type, badge, badge_color, of_active, of_price, of_wholesale_price, of_original_price, of_stock, of_badge, of_badge_color FROM product_variants ORDER BY product_id, id`,
  })

  return (result as any).rows
}

const getVariantsCached = unstable_cache(
  getVariants,
  ["variants"],
  { revalidate: 3600, tags: ["products"] }
)

async function getProductsWithVariants() {

  const [productRows, variantRows, categoryRows] = await Promise.all([
    _loadProductsWithStock(),
    getVariants(),
    getCategories()
  ])

  const categoryById = new Map<number, any>(categoryRows.map((row: any) => [row.id, row]))
  const productMap = new Map<number, any>()

  for (const row of productRows) {
    productMap.set(row.id, {
      id: row.id,
      name: row.name,
      price: row.price,
      wholesale_price: row.wholesale_price,
      original_price: row.original_price,
      image: row.image || '/images/placeholder.webp',
      images: [],
      category_id: row.category_id,
      category: categoryById.get(row.category_id)?.name,
      is_new: row.is_new ?? false,
      is_sale: row.is_sale ?? false,
      is_active: 1,
      of_price: row.of_price,
      of_wholesale_price: row.of_wholesale_price,
      of_original_price: row.of_original_price,
      of_stock: row.of_stock,
      of_badge: row.of_badge,
      of_badge_color: row.of_badge_color,
      of_active: row.of_active ?? 0,
      min_wholesale: row.min_wholesale ?? 12,
      rating: 4.5,
      reviews: 0,
      features: ["Suavidad", "Relleno antialergico", "Durabilidad", "Facil lavado"],
      stock: row.stock ?? 0,
      product_stock: row.stock ?? 0,
      badge: row.badge,
      badge_color: row.badge_color,
      variants: [],
      adult_variants: [],
      child_variants: [],
      adult_images: [],
      child_images: [],
    })
  }

  for (const row of variantRows) {
    const product = productMap.get(row.product_id)
    if (!product) continue

    const variantEntry = {
      id: String(row.id),
      label: row.label,
      price: row.price,
      wholesale_price: row.wholesale_price,
      stock: row.stock ?? 0,
      badge: row.badge,
      badge_color: row.badge_color,
      is_active: 1,
      of_active: row.of_active ?? 0,
      of_price: row.of_price,
      of_wholesale_price: row.of_wholesale_price,
      of_original_price: row.of_original_price,
      of_stock: row.of_stock,
      of_badge: row.of_badge,
      of_badge_color: row.of_badge_color,
    }

    if (row.variant_type === "adult") {
      product.adult_variants.push(variantEntry)
    } else if (row.variant_type === "child") {
      product.child_variants.push(variantEntry)
    } else {
      product.variants.push(variantEntry)
    }

    product.stock += variantEntry.stock
  }

  return Array.from(productMap.values()).filter((product: any) => product.is_active !== 0).sort((a: any, b: any) => a.id - b.id)
}

const getProductsWithVariantsCached = unstable_cache(
  getProductsWithVariants,
  ["products-with-variants"],
  { revalidate: 3600, tags: ["products"] }
)

function invalidateProductCatalogCache() {
  revalidateTag("products", {})
}

function invalidateReviewCache() {
  revalidateTag("reviews", {})
}

export async function rateProduct(productId: number, rating: number, comment?: string, username?: string, avatar?: string) {

  // Insert review
  await turso.execute({
    sql: `INSERT INTO reviews (product_id, rating, comment, username, avatar) VALUES (?, ?, ?, ?, ?)`,
    args: [productId, rating, comment || null, username || null, avatar || null]
  })

  // Update counters
  await turso.execute({
    sql: `UPDATE products SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?`,
    args: [rating, productId]
  })

  // Invalidate cache
  invalidateReviewCache()

  // Get new average
  const result = await turso.execute({
    sql: `SELECT rating_sum, rating_count FROM products WHERE id = ?`,
    args: [productId]
  })

  const row = (result as any).rows[0]
  if (row) {
    return {
      avg: row.rating_sum / row.rating_count,
      count: row.rating_count
    }
  }
}

let ratingsReviewsCache: { data: { ratings: any; reviews: any }; timestamp: number } | null = null
const RATINGS_REVIEWS_TTL = 60 * 1000

export async function getAllRatingsAndReviews(cursor?: string | null, limit = 100) {
   const now = Date.now()
   const pageSize = Math.min(Math.max(limit, 1), 200)

   if (!cursor) {
     if (ratingsReviewsCache && now - ratingsReviewsCache.timestamp < RATINGS_REVIEWS_TTL) {
       return ratingsReviewsCache.data
     }
   }
   
   
   // Single query for all products with ratings
   const ratingsResult = await turso.execute({
     sql: `SELECT id, rating_sum, rating_count FROM products WHERE rating_count > 0`,
   })

   let reviewsQuery = `SELECT product_id, id, rating, comment, username, avatar, created_at FROM reviews`
   const reviewsArgs: any[] = []
   
    if (cursor) {
      // Cursor format is `${created_at}_${id}` (see nextCursor below).
      // Split on the last "_" so the ISO timestamp (which contains no "_") stays intact.
      const underscoreIndex = cursor.lastIndexOf("_")
      const cursorCreatedAt = underscoreIndex >= 0 ? cursor.slice(0, underscoreIndex) : cursor
      const cursorId = underscoreIndex >= 0 ? parseInt(cursor.slice(underscoreIndex + 1) || "0", 10) : 0
      reviewsQuery += ` WHERE created_at < ? OR (created_at = ? AND id < ?)`
      reviewsArgs.push(cursorCreatedAt, cursorCreatedAt, cursorId)
    }
   
   reviewsQuery += ` ORDER BY created_at DESC, id DESC LIMIT ?`
   reviewsArgs.push(pageSize)

   // Single query for all reviews (paginated)
   const reviewsResult = await turso.execute({
     sql: reviewsQuery,
     args: reviewsArgs,
   })

   // Get ALL products with their static rating data
   const allProductsResult = await turso.execute({
     sql: `SELECT id, name FROM products`,
   })

   const ratings: Record<number, { avg: number; count: number }> = {}
   const rows = (ratingsResult as any).rows
   for (const row of rows) {
     ratings[row.id] = {
       avg: row.rating_sum / row.rating_count,
       count: row.rating_count
     }
   }

   // Also get product names for sample reviews
   const productNames: Record<number, string> = {}
   const allProductsRows = (allProductsResult as any).rows
   for (const row of allProductsRows) {
     productNames[row.id] = row.name
   }

   const getRandomUserAvatar = (id: number) => {
     const gender = id % 2 === 0 ? "women" : "men"
     const imageId = ((id * 17 + Math.floor(Math.abs(id) / 100)) % 90) + 1
     return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`
   }

   const LATIN_COMMENTS: Record<string, string[]> = {
     peluche: [
       "¡Muy tierno y suave! Mi hija lo adora.",
       "Calidad excelente, llegó en perfectas condiciones.",
       "Ideal para regalar, superó mis expectativas."
     ],
     cervical: [
       "Perfecta para viajes largos, muy cómoda.",
       "Excelente calidad del relleno antialérgico.",
       "Mejor de lo esperado, muy práctica."
     ],
     cojin: [
       "Hermoso diseño, llena perfecto mi salón.",
       "Muy suave y decorativa, llegó rápido.",
       "Calidad premium, vale cada peso invertido."
     ],
     lata: [
       "Diseño original y muy divertido.",
       "Ideal para guardar dulces, muy útil.",
       "Perfecta decoración para mi cuarto."
     ],
     llavero: [
       "Muy práctico y bonito, gran detalle.",
       "Calidad excelente para su pequeño tamaño.",
       "Perfecto para agarradera de mochila."
     ],
     default: [
       "Excelente producto, muy recomendable.",
       "Calidad superior, llegó rápido.",
       "Perfecto, exactamente lo que esperaba."
     ]
   }

   const getSampleReviews = (productId: number, avgRating: number, count: number): any[] => {
     const productName = productNames[productId] || "Producto"
     const category = productName.toLowerCase().includes("peluche") ? "peluche" :
                     productName.toLowerCase().includes("cervical") ? "cervical" :
                     productName.toLowerCase().includes("cojin") ? "cojin" :
                     productName.toLowerCase().includes("lata") ? "lata" :
                     productName.toLowerCase().includes("llavero") ? "llavero" : "default"
     
     const comments = LATIN_COMMENTS[category]
     const commentIndex = (Math.abs(productId) * 7 + productName.length * 3) % comments.length
     const nameIndex = (Math.abs(productId) * 5 + productId.toString().charCodeAt(0) || 0) % LATIN_NAMES.length
     const imageId = ((productId * 17 + Math.floor(Math.abs(productId) / 100)) % 90) + 1
     const gender = productId % 2 === 0 ? "women" : "men"
     
     return [{
       id: -Math.abs(productId),
       rating: Math.max(1, Math.min(5, Math.round(avgRating))),
       comment: comments[commentIndex],
       avatar: `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`,
       username: LATIN_NAMES[nameIndex],
       created_at: new Date(now).toISOString()
     }]
   }

   const reviewsByProduct: Record<number, any[]> = {}
   const reviewRows = (reviewsResult as any).rows
   
   for (const row of reviewRows) {
     if (!reviewsByProduct[row.product_id]) {
       reviewsByProduct[row.product_id] = []
     }
     reviewsByProduct[row.product_id].push({
       id: row.id,
       rating: row.rating,
       comment: row.comment,
       avatar: row.avatar || getRandomUserAvatar(row.id),
       username: row.username || LATIN_NAMES[row.id % LATIN_NAMES.length],
       created_at: row.created_at
     })
   }

   // Add sample reviews for ALL products that have no reviews
   for (const row of allProductsRows) {
     if (!reviewsByProduct[row.id] || reviewsByProduct[row.id].length === 0) {
       const avgRating = ratings[row.id]?.avg || 4.5
       const count = ratings[row.id]?.count || 50
       reviewsByProduct[row.id] = getSampleReviews(row.id, avgRating, count)
       
       // Add to ratings if not exists
       if (!ratings[row.id]) {
         ratings[row.id] = { avg: avgRating, count }
       }
     }
   }

    if (!cursor) {
      const response = { ratings, reviews: reviewsByProduct }
      ratingsReviewsCache = { data: response, timestamp: Date.now() }
      return response
    }

   const lastReview = reviewRows[reviewRows.length - 1]
   const nextCursor = lastReview ? `${lastReview.created_at}_${lastReview.id}` : null

    return {
      ratings,
      reviews: reviewsByProduct,
      nextCursor,
      hasMore: reviewRows.length >= pageSize,
    }
  }
  
  export async function createOrderAction(data: {
  mode: "retail" | "wholesale"
  email: string
  phone: string
  businessName?: string
  nit?: string
  firstName?: string
  lastName?: string
  address?: string
  apartment?: string
  city?: string
  department?: string
  postalCode?: string
  paymentMethod: string
  paymentReference: string
  paymentScreenshot?: string
  subtotal: number
  shippingCost: number
  total: number
  notes?: string
  items: Array<{
    productId: number
    productName: string
    productPrice: number
    quantity: number
    variantLabel?: string
  }>
}): Promise<{ orderId: number; orderNumber: string } | { error: string }> {

   if (!data.items.length) {
     return { error: "No hay productos en el pedido" }
   }

   const orderNumber = `${data.mode === "wholesale" ? "COT" : "PEL"}-${randomBytes(6).toString("hex").toUpperCase()}`

   // Single transaction: order + stock reduction + items are atomic.
   // If any item lacks stock we rollback everything (no orphan order, no partial stock).
   const tx = await turso.transaction("write")

   try {
     const result = await tx.execute({
       sql: `INSERT INTO orders (
         order_number, mode, email, phone, business_name, nit,
         first_name, last_name, address, apartment, city, department, postal_code,
         payment_method, payment_reference, payment_screenshot,
         subtotal, shipping_cost, total, notes, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
       args: [
         orderNumber,
         data.mode,
         data.email,
         data.phone,
         data.businessName || null,
         data.nit || null,
         data.firstName || null,
         data.lastName || null,
         data.address || null,
         data.apartment || null,
         data.city || null,
         data.department || null,
         data.postalCode || null,
         data.paymentMethod,
         data.paymentReference,
         data.paymentScreenshot || null,
         data.subtotal,
         data.shippingCost,
         data.total,
         data.notes || null,
       ],
     })

     const orderId = Number((result as any).lastInsertRowid)

     for (const item of data.items) {
       const variantLabel = item.variantLabel && item.variantLabel.trim() !== "" ? item.variantLabel : null

       const sufficientStock = variantLabel
         ? await reduceVariantStock(item.productId, variantLabel, item.quantity, tx)
         : await reduceProductStock(item.productId, item.quantity, tx)

       if (!sufficientStock) {
         await tx.rollback()
         return { error: `Stock insuficiente para: ${item.productName}` }
       }

       await tx.execute({
         sql: `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total, variant_label)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
         args: [
           orderId,
           item.productId,
           item.productName,
           item.productPrice,
           item.quantity,
           item.productPrice * item.quantity,
           variantLabel,
         ],
       })
     }

     await tx.commit()
     invalidateProductCatalogCache()

     return { orderId, orderNumber }
   } catch (error) {
     try {
       await tx.rollback()
     } catch {
     }
     console.error("createOrderAction error:", error)
     return { error: "Ocurrió un error al procesar el pedido. Inténtalo de nuevo." }
   }
  }

export async function uploadScreenshotAction(formData: FormData) {
  const file = formData.get("file") as File | null

  if (!file) {
    throw new Error("No file provided")
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT
  
  if (!privateKey || !publicKey || !urlEndpoint) {
    throw new Error("ImageKit credentials not configured")
  }

  const bytes = await file.arrayBuffer()
  
  const timestamp = Date.now().toString()
  const uniqueFileName = `payments/${timestamp}-${file.name.replace(/\s+/g, '-')}`
  
  const body = new FormData()
  body.append("file", new Blob([bytes], { type: file.type }), file.name)
  body.append("fileName", uniqueFileName)
  body.append("publicKey", publicKey)

  const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(privateKey + ":").toString("base64"),
    },
    body,
  })

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()
    throw new Error("Upload failed: " + errorText)
  }

  const result = await uploadResponse.json()
  const imageUrl = `${urlEndpoint}/${result.name}`

  return { url: imageUrl, filename: result.name }
}

export async function submitContactForm(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    console.error("RESEND_API_KEY no configurada")
    return { success: true }
  }
  
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + resendApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Mundo Disney <onboarding@resend.dev>",
        to: ["fabricadepeluchesmundodisney@gmail.com"],
        subject: "Nuevo contacto: " + data.subject,
        html: "<h2>Nuevo mensaje de contacto</h2><p><strong>Nombre:</strong> " + data.name + "</p><p><strong>Email:</strong> " + data.email + "</p><p><strong>Telefono:</strong> " + (data.phone || "No especificado") + "</p><p><strong>Asunto:</strong> " + data.subject + "</p><p><strong>Mensaje:</strong> " + data.message + "</p>"
      })
    })
    
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      console.error("Resend API error:", result)
    }
    
    return { success: true }
  } catch (emailError) {
    console.error("Email send error:", emailError)
    return { success: true }
  }
}

function getOfertasFromCatalog() {
  return getProductsWithVariantsCached().then(products => products.filter((product: any) => {
    if (product.is_active === 0) return false

    const hasProductOffer = product.of_active || product.of_price || product.of_original_price || product.of_badge
    const hasVariantOffer = product.variants?.some((variant: any) => variant.of_active || variant.of_price || variant.of_original_price || variant.of_stock || variant.of_badge) ||
      product.adult_variants?.some((variant: any) => variant.of_active || variant.of_price || variant.of_original_price || variant.of_stock || variant.of_badge) ||
      product.child_variants?.some((variant: any) => variant.of_active || variant.of_price || variant.of_original_price || variant.of_stock || variant.of_badge)

    return hasProductOffer || hasVariantOffer
  }))
}

export async function getProductStock(productId: number): Promise<number> {
  
  const result = await turso.execute({
    sql: `SELECT stock FROM products WHERE id = ?`,
    args: [productId]
  })
  
  const row = (result as any).rows[0]
  return row ? row.stock : 0
}

export async function addProductStock(productId: number, quantity: number): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE products SET stock = stock + ? WHERE id = ?`,
    args: [quantity, productId]
  })
  invalidateProductCatalogCache()
}

export async function reduceProductStock(productId: number, quantity: number, executor: any = turso): Promise<boolean> {

  const result = await executor.execute({
    sql: `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
    args: [quantity, productId, quantity]
  })

  if ((result as any).rowsAffected === 0) {
    return false
  }

  invalidateProductCatalogCache()
  return true
}

export async function setProductStock(productId: number, quantity: number): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE products SET stock = ? WHERE id = ?`,
    args: [quantity, productId]
  })
  invalidateProductCatalogCache()
}

export async function getVariantsByProductId(productId: number): Promise<Array<{
  id: number
  product_id: number
  label: string
  price: number
  wholesale_price: number
  stock: number
}>> {
  const variants = await getVariantsCached()
  return variants.filter((variant: any) => variant.product_id === productId)
}

export async function seedProductsAndVariants(): Promise<void> {

  const categories = [
    { name: "llaveros", slug: "llaveros" },
    { name: "peluches", slug: "peluches" },
    { name: "cojines", slug: "cojines" },
    { name: "latas", slug: "latas" },
    { name: "cervicales", slug: "cervicales" },
    { name: "ropa", slug: "ropa" },
  ]

  const categoryIds: Record<string, number> = {}

  for (const cat of categories) {
    const result = await turso.execute({
      sql: `SELECT id FROM categories WHERE slug = ?`,
      args: [cat.slug],
    })

    const row = (result as any).rows[0]
    if (row) {
      categoryIds[cat.slug] = row.id
    } else {
      const insertResult = await turso.execute({
        sql: `INSERT INTO categories (name, slug) VALUES (?, ?)`,
        args: [cat.name, cat.slug],
      })
      categoryIds[cat.slug] = Number((insertResult as any).lastInsertRowid)
    }
  }

  const allProducts = [
    // Llaveros
    { id: 501, name: "Llavero Surtidos", price: 20000, image: "/images/llaveros/1.webp", category: "llaveros", stock: 100, variants: [{ label: "Paquete 20 unidades", price: 20000 }, { label: "Paquete 40 unidades", price: 40000 }] },
    // Peluches
    { id: 101, name: "Peluche Milo Gato", price: 60000, originalPrice: 55000, image: "/images/peluches/1.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 15 },
    { id: 102, name: "Peluche Mimi Gata", price: 60000, originalPrice: 72000, image: "/images/peluches/2.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 25 },
    { id: 103, name: "Peluche Bubu Mono", price: 68000, originalPrice: 85000, image: "/images/peluches/3.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 18 },
    { id: 104, name: "Peluche Lala Mona", price: 55000, image: "/images/peluches/4.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 22 },
    { id: 105, name: "Peluche Dodo Conejo", price: 48000, image: "/images/peluches/5.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 30 },
    { id: 106, name: "Peluche Buny Coneja", price: 42000, originalPrice: 50000, image: "/images/peluches/6.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 12 },
    { id: 107, name: "Peluche Max Perro", price: 42000, originalPrice: 50000, image: "/images/peluches/7.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 14 },
    { id: 108, name: "Peluche Kira Perra", price: 42000, originalPrice: 50000, image: "/images/peluches/8.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 16 },
    { id: 109, name: "Peluche Roco Toro", price: 42000, originalPrice: 50000, image: "/images/peluches/9.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 11 },
    { id: 110, name: "Peluche Mura Vaca", price: 42000, originalPrice: 50000, image: "/images/peluches/10.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 13 },
    { id: 111, name: "Peluche Nube Oveja", price: 42000, originalPrice: 50000, image: "/images/peluches/11.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 17 },
    { id: 112, name: "Peluche Kimi Oveja", price: 42000, originalPrice: 50000, image: "/images/peluches/12.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 12 },
    { id: 113, name: "Peluche Gino Jirafa", price: 42000, originalPrice: 50000, image: "/images/peluches/13.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 10 },
    { id: 114, name: "Peluche Jira Jirafa", price: 42000, originalPrice: 50000, image: "/images/peluches/14.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 8 },
    { id: 115, name: "Peluche Drako Dragon", price: 42000, originalPrice: 50000, image: "/images/peluches/15.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 14 },
    { id: 116, name: "Peluche Drini Dragon", price: 42000, originalPrice: 50000, image: "/images/peluches/16.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 19 },
    { id: 117, name: "Peluche Orejon Conejo Nino", price: 42000, originalPrice: 50000, image: "/images/peluches/17.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 20 },
    { id: 118, name: "Peluche Orejon Coneja Nina", price: 42000, originalPrice: 50000, image: "/images/peluches/18.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 16 },
    { id: 119, name: "Peluche Orejon Perro Nino", price: 42000, originalPrice: 50000, image: "/images/peluches/19.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 18 },
    { id: 120, name: "Peluche Orejon Perra Nina", price: 42000, originalPrice: 50000, image: "/images/peluches/20.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 70000 }, { label: "#3 - 60cm", price: 130000 }, { label: "#4 - 100cm", price: 160000 }], stock: 11 },
    // Cojines
    { id: 201, name: "Cojin Corazon Lo Lograstes", price: 35000, originalPrice: 42000, image: "/images/cojines/1.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 20 },
    { id: 202, name: "Cojin Corazon Felicitaciones", price: 38000, image: "/images/cojines/2.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 28 },
    { id: 203, name: "Cojin Corazon Feliz Dia Mama", price: 32000, image: "/images/cojines/3.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 35 },
    { id: 204, name: "Cojin Corazon Me Gustas", price: 45000, image: "/images/cojines/4.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 26 },
    { id: 205, name: "Cojin Corazon Me Gustas", price: 42000, originalPrice: 50000, image: "/images/cojines/5.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 22 },
    { id: 206, name: "Cojin Corazon Te Amo", price: 48000, image: "/images/cojines/6.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 18 },
    { id: 207, name: "Cojin Corazon Te Quiero", price: 48000, image: "/images/cojines/7.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 24 },
    { id: 208, name: "Cojin Corazon Feliz Dia", price: 48000, image: "/images/cojines/8.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 19 },
    { id: 209, name: "Cojin Corazon TQM", price: 48000, image: "/images/cojines/9.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 17 },
    { id: 210, name: "Cojin Corazon Eres Especial", price: 48000, image: "/images/cojines/10.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 21 },
    { id: 211, name: "Cojin Corazon Feliz Cumpleanos", price: 48000, image: "/images/cojines/11.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 15 },
    { id: 212, name: "Cojin Corazon Te ExtraNo", price: 48000, image: "/images/cojines/12.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 13 },
    { id: 2120, name: "Cojin Corazon Eres Tu", price: 48000, image: "/images/cojines/17.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 10 },
    { id: 2121, name: "Cojin Corazon Eres mi Felicidad", price: 48000, image: "/images/cojines/18.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 25000 }], stock: 14 },
    { id: 213, name: "Cojin Cuadrado Portugal", price: 48000, image: "/images/cojines/13.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 25000 }], stock: 25 },
    { id: 214, name: "Cojin Cuadrado Argentina", price: 48000, image: "/images/cojines/14.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 25000 }], stock: 28 },
    { id: 215, name: "Cojin Cuadrado Colombia", price: 48000, image: "/images/cojines/15.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 25000 }], stock: 22 },
    { id: 216, name: "Cojin Cuadrado Brasil", price: 48000, image: "/images/cojines/16.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 25000 }], stock: 30 },
    // Latas
    { id: 301, name: "Lata Te ExtraNo", price: 18000, image: "/images/lata/2.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 45 },
    { id: 302, name: "Lata Me Gustas", price: 18000, originalPrice: 28000, image: "/images/lata/4.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 38 },
    { id: 303, name: "Lata TQM", price: 18000, image: "/images/lata/5.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 52 },
    { id: 304, name: "Lata Te Amo", price: 18000, image: "/images/lata/7.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 28 },
    { id: 305, name: "Lata Felicitaciones", price: 26000, originalPrice: 32000, image: "/images/lata/6.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 34 },
    { id: 306, name: "Lata Los Simpsons", price: 23000, image: "/images/lata/3.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 40 },
    { id: 307, name: "Lata Futbol Portugal", price: 23000, image: "/images/lata/8.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 36 },
    { id: 308, name: "Lata Futbol Colombia", price: 23000, image: "/images/lata/1.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 42 },
    { id: 309, name: "Lata Futbol Brasil", price: 23000, image: "/images/lata/9.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 48 },
    { id: 310, name: "Lata Futbol Argentina", price: 18000, image: "/images/lata/10.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 32 },
    { id: 311, name: "Lata Futbol Barcelona", price: 18000, image: "/images/lata/11.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 38 },
    { id: 312, name: "Lata Futbol Barcelona", price: 18000, image: "/images/lata/12.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 30000 }], stock: 26 },
    // Cervicales
    { id: 401, name: "Cervical Futbol Brasil", price: 15000, originalPrice: 20000, image: "/images/cervicales/1.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 45 },
    { id: 402, name: "Cervical Futbol Colombia", price: 15000, image: "/images/cervicales/2.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 55 },
    { id: 403, name: "Cervical Futbol Argentina", price: 15000, originalPrice: 15000, image: "/images/cervicales/3.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 32 },
    { id: 404, name: "Cervical Futbol Real Madrid", price: 15000, image: "/images/cervicales/4.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 40 },
    { id: 405, name: "Cervical Futbol Portugal", price: 15000, originalPrice: 58000, image: "/images/cervicales/5.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }], stock: 38 },
    { id: 406, name: "Cervical Te Quiero", price: 18000, image: "/images/cervicales/6.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 50 },
    { id: 407, name: "Cervical Feliz Dia Mama", price: 18000, image: "/images/cervicales/7.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 45 },
    { id: 408, name: "Cervical TQM", price: 18000, image: "/images/cervicales/8.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 60 },
    { id: 409, name: "Cervical Eres Especial", price: 18000, image: "/images/cervicales/9.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 40 },
    { id: 410, name: "Cervical Eres Especial", price: 18000, image: "/images/cervicales/10.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 35 },
    { id: 411, name: "Cervical Lo Lograstes", price: 18000, image: "/images/cervicales/11.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 48 },
    { id: 412, name: "Cervical Felicitaciones", price: 18000, image: "/images/cervicales/12.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 38 },
    { id: 413, name: "Cervical Feliz Dia", price: 18000, image: "/images/cervicales/13.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 42 },
    { id: 414, name: "Cervical Bienvenido a la Familia", price: 18000, image: "/images/cervicales/14.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 44 },
    { id: 415, name: "Cervical Me Gustas", price: 18000, image: "/images/cervicales/15.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 52 },
    { id: 416, name: "Cervical Feliz Cumple AOs", price: 18000, image: "/images/cervicales/16.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 30000 }], stock: 36 },
    { id: 417, name: "Cervical Te Amo", price: 18000, image: "/images/cervicales/17.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 46 },
    { id: 418, name: "Cervical Futbol Barcelona", price: 15000, originalPrice: 58000, image: "/images/cervicales/18.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }], stock: 28 },
    { id: 419, name: "Cervical Eres Tu", price: 18000, image: "/images/cervicales/20.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 48 },
    { id: 420, name: "Cervical Mi Felicidad", price: 18000, image: "/images/cervicales/20.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 25000 }, { label: "Con Antifaz", price: 30000 }], stock: 55 },
    // Ropa
    { id: 701, name: "Hoodie Dragona", price: 45000, originalPrice: 55000, image: "/images/ropa/1.webp", category: "ropa", stock: 90, variants: [], adultVariants: [{ label: "S", price: 50000 }, { label: "M", price: 60000 }, { label: "L", price: 70000 }, { label: "XL", price: 80000 }], childVariants: [{ label: "4", price: 35000 }, { label: "6", price: 38000 }, { label: "8", price: 41000 }, { label: "10", price: 44000 }, { label: "12", price: 47000 }] },
  ]

  for (const p of allProducts) {
    const existing = await turso.execute({
      sql: `SELECT id FROM products WHERE id = ?`,
      args: [p.id],
    })

    const isOfertaProduct = !!p.originalPrice

    let productId: number
    if ((existing as any).rows.length > 0) {
      await turso.execute({
        sql: `UPDATE products SET name = ?, price = ?, wholesale_price = ?, image = ?, category_id = ?, is_new = ?, is_sale = ?, stock = ?, of_active = ?, of_price = ?, of_original_price = ?, of_stock = ?, of_badge = ?, of_badge_color = ? WHERE id = ?`,
        args: [p.name, p.price, p.price, p.image, categoryIds[p.category], !!(p as any).badge, !!p.originalPrice, p.stock, isOfertaProduct ? 1 : 0, isOfertaProduct ? p.price : null, isOfertaProduct ? p.originalPrice : null, isOfertaProduct ? p.stock : 0, isOfertaProduct ? "OFERTA" : null, isOfertaProduct ? "bg-red-500" : null, p.id],
      })
      productId = p.id
    } else {
      const result = await turso.execute({
        sql: `INSERT INTO products (name, price, wholesale_price, image, category_id, is_new, is_sale, stock, of_active, of_price, of_original_price, of_stock, of_badge, of_badge_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [p.name, p.price, p.price, p.image, categoryIds[p.category], !!(p as any).badge, !!p.originalPrice, p.stock, isOfertaProduct ? 1 : 0, isOfertaProduct ? p.price : null, isOfertaProduct ? p.originalPrice : null, isOfertaProduct ? p.stock : 0, isOfertaProduct ? "OFERTA" : null, isOfertaProduct ? "bg-red-500" : null],
      })
      productId = Number((result as any).lastInsertRowid)
    }

    const variantEntries: any[] = []
    if (p.variants) {
      variantEntries.push(...p.variants.map(v => ({ ...v, type: 'general' })))
    }
    if (p.adultVariants) {
      variantEntries.push(...p.adultVariants.map(v => ({ label: v.label, price: v.price, type: 'adult' })))
    }
    if (p.childVariants) {
      variantEntries.push(...p.childVariants.map(v => ({ label: v.label, price: v.price, type: 'child' })))
    }

    for (const v of variantEntries) {
      const existingV = await turso.execute({
        sql: `SELECT id FROM product_variants WHERE product_id = ? AND label = ?`,
        args: [productId, v.label],
      })

      const baseStock = Math.floor((p.stock || 0) / Math.max(variantEntries.length, 1))

      if ((existingV as any).rows.length > 0) {
        await turso.execute({
          sql: `UPDATE product_variants SET price = ?, wholesale_price = ?, stock = ?, variant_type = ?, of_active = ?, of_price = ?, of_original_price = ?, of_stock = ?, of_badge = ?, of_badge_color = ? WHERE product_id = ? AND label = ?`,
          args: [v.price, v.price, baseStock, v.type || 'general', isOfertaProduct ? 1 : 0, isOfertaProduct ? v.price : null, isOfertaProduct ? p.originalPrice : null, isOfertaProduct ? baseStock : 0, isOfertaProduct ? "OFERTA" : null, isOfertaProduct ? "bg-red-500" : null, productId, v.label],
        })
      } else {
        await turso.execute({
          sql: `INSERT INTO product_variants (product_id, label, price, wholesale_price, stock, variant_type, of_active, of_price, of_original_price, of_stock, of_badge, of_badge_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [productId, v.label, v.price, v.price, baseStock, v.type || 'general', isOfertaProduct ? 1 : 0, isOfertaProduct ? v.price : null, isOfertaProduct ? p.originalPrice : null, isOfertaProduct ? baseStock : 0, isOfertaProduct ? "OFERTA" : null, isOfertaProduct ? "bg-red-500" : null],
        })
      }
    }
  }

  invalidateProductCatalogCache()
}

export async function seedProductsFromData() {
  await seedProductsAndVariants()
  return { success: true }
}

export async function upsertProductVariants(productId: number, variants: Array<{
  label: string
  price: number
  wholesalePrice: number
  stock: number
}>): Promise<void> {

  const cachedVariants = await getVariantsCached()
  let inserted = false

  for (const v of variants) {
    if (cachedVariants.some((variant: any) => variant.product_id === productId && variant.label === v.label)) {
      continue
    }

    await turso.execute({
      sql: `INSERT INTO product_variants (product_id, label, price, wholesale_price, stock) VALUES (?, ?, ?, ?, ?)`,
      args: [productId, v.label, v.price, v.wholesalePrice, v.stock]
    })
    inserted = true
  }

  if (inserted) {
    invalidateProductCatalogCache()
  }
}

function normalizeLabel(label: string): string {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export async function getVariantStock(productId: number, variantLabel: string): Promise<number> {
  const result = await turso.execute({
    sql: `SELECT stock FROM product_variants WHERE product_id = ? AND LOWER(label) = LOWER(?) COLLATE NOCASE`,
    args: [productId, variantLabel]
  })
  const row = (result as any).rows[0]
  return row ? row.stock : 0
}

export async function reduceVariantStock(productId: number, variantLabel: string, quantity: number, executor: any = turso): Promise<boolean> {
  const result = await executor.execute({
    sql: `UPDATE product_variants SET 
          stock = CASE WHEN of_active != 1 THEN stock - ? ELSE stock END,
          of_stock = CASE WHEN of_active = 1 THEN of_stock - ? ELSE of_stock END
          WHERE product_id = ? AND LOWER(label) = LOWER(?) COLLATE NOCASE
          AND ((of_active != 1 AND stock >= ?) OR (of_active = 1 AND of_stock >= ?))`,
    args: [quantity, quantity, productId, variantLabel, quantity, quantity]
  })

  if ((result as any).rowsAffected === 0) {
    return false
  }

  invalidateProductCatalogCache()
  return true
}

let exchangeRateCache: { rate: number; timestamp: number } | null = null
const EXCHANGE_RATE_TTL = 24 * 60 * 60 * 1000

export async function getExchangeRateAction(): Promise<number> {
  const now = Date.now()

  if (exchangeRateCache && now - exchangeRateCache.timestamp < EXCHANGE_RATE_TTL) {
    return exchangeRateCache.rate
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch("https://co.dolarapi.com/v1/trm", {
      next: { revalidate: 86400 },
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }

    const data = await response.json()
    const trm = data.valor

    if (trm) {
      exchangeRateCache = { rate: 1 / trm, timestamp: now }
      return exchangeRateCache.rate
    }
  } catch (error) {
    clearTimeout(timeout)
    console.error("Exchange rate fetch error:", error)
  }

  return 0.00025
}

export async function getProductsWithVariantsFromDB(categorySlug?: string): Promise<Array<{
  id: number
  name: string
  price: number
  wholesale_price: number
  original_price?: number
  image: string
  images?: string[]
  category_id: number
  category?: string
  badge?: string
  badge_color?: string
  rating?: number
  reviews?: number
  features?: string[]
  stock: number
  is_new?: boolean
  is_sale?: boolean
  min_wholesale?: number
  variants?: Array<{
    id: number
    label: string
    price: number
    wholesale_price: number
    stock: number
    badge?: string
    badge_color?: string
    is_active?: boolean
  }>
  adult_variants?: Array<{
    id: number
    label: string
    price: number
    wholesale_price: number
    stock: number
    badge?: string
    badge_color?: string
    is_active?: boolean
  }>
  child_variants?: Array<{
    id: number
    label: string
    price: number
    wholesale_price: number
    stock: number
    badge?: string
    badge_color?: string
    is_active?: boolean
  }>
  adult_images?: string[]
  child_images?: string[]
}>> {
  const products = await getProductsWithVariantsCached()
  if (!categorySlug) return products

  return products.filter((product: any) => product.category === categorySlug)
}

export async function updateProductPrice(productId: number, price: number, wholesalePrice: number, originalPrice?: number): Promise<void> {
  
  if (originalPrice !== undefined) {
    await turso.execute({
      sql: `UPDATE products SET price = ?, wholesale_price = ?, original_price = ? WHERE id = ?`,
      args: [price, wholesalePrice, originalPrice, productId]
    })
  } else {
    await turso.execute({
      sql: `UPDATE products SET price = ?, wholesale_price = ? WHERE id = ?`,
      args: [price, wholesalePrice, productId]
    })
  }
  invalidateProductCatalogCache()
}

export async function updateProductStock(productId: number, stock: number): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE products SET stock = ? WHERE id = ?`,
    args: [stock, productId]
  })
  invalidateProductCatalogCache()
}

export async function updateProductBadge(productId: number, isNew: boolean, isSale: boolean, badge?: string, badgeColor?: string): Promise<void> {
  const ofActive = isSale ? 1 : 0
  await turso.execute({
    sql: `UPDATE products SET is_new = ?, is_sale = ?, badge = ?, badge_color = ?, of_active = ? WHERE id = ?`,
    args: [isNew ? 1 : 0, ofActive, badge || null, badgeColor || null, ofActive, productId]
  })
  invalidateProductCatalogCache()
}

export async function updateVariantBadge(variantId: number, badge?: string, badgeColor?: string): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE product_variants SET badge = ?, badge_color = ? WHERE id = ?`,
    args: [badge || null, badgeColor || null, variantId]
  })
  invalidateProductCatalogCache()
}

export async function updateVariantPrice(variantId: number, price: number, wholesalePrice: number): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE product_variants SET price = ?, wholesale_price = ? WHERE id = ?`,
    args: [price, wholesalePrice, variantId]
  })
  invalidateProductCatalogCache()
}

export async function updateVariantStock(variantId: number, stock: number): Promise<void> {
  
  await turso.execute({
    sql: `UPDATE product_variants SET stock = ? WHERE id = ?`,
    args: [stock, variantId]
  })
  invalidateProductCatalogCache()
}

export async function createProduct(data: {
  name: string
  price: number
  wholesalePrice: number
  originalPrice?: number
  image: string
  category: string
  stock: number
  isNew?: boolean
  isSale?: boolean
  badge?: string
  badgeColor?: string
  features?: string[]
}): Promise<number> {
  await requireAdmin()

  const categoryResult = await turso.execute({
    sql: `SELECT id FROM categories WHERE slug = ?`,
    args: [data.category]
  })

  const categoryRow = (categoryResult as any).rows[0]
  if (!categoryRow) {
    throw new Error(`Category ${data.category} not found`)
  }

  const result = await turso.execute({
    sql: `INSERT INTO products (name, price, wholesale_price, image, category_id, is_new, is_sale, stock, of_active, of_price, of_original_price, of_stock, of_badge, of_badge_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [data.name, data.price, data.wholesalePrice, data.image, categoryRow.id, !!(data.isNew || data.badge), !!data.originalPrice, data.stock, data.originalPrice ? 1 : 0, data.originalPrice ? data.price : null, data.originalPrice || null, data.originalPrice ? data.stock : 0, data.originalPrice ? "OFERTA" : null, data.originalPrice ? "bg-red-500" : null],
  })

  invalidateProductCatalogCache()
  return Number((result as any).lastInsertRowid)
}

export async function deleteProduct(productId: number): Promise<void> {
  
  await turso.execute({
    sql: `DELETE FROM products WHERE id = ?`,
    args: [productId]
  })
  invalidateProductCatalogCache()
}

export async function createVariant(productId: number, data: {
  label: string
  price: number
  wholesalePrice: number
  stock: number
  variantType?: string
}): Promise<number> {
  
  const result = await turso.execute({
    sql: `INSERT INTO product_variants (product_id, label, price, wholesale_price, stock, variant_type) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      productId,
      data.label,
      data.price,
      data.wholesalePrice,
      data.stock,
      data.variantType || 'general'
    ]
  })
  
  invalidateProductCatalogCache()
  return Number((result as any).lastInsertRowid)
}

export async function getAllOrders(): Promise<Array<{
   id: number
   order_number: string
   mode: string
   status: string
   email: string
   phone: string
   business_name?: string
   nit?: string
   first_name?: string
   last_name?: string
   address?: string
   city?: string
   department?: string
   payment_method: string
   payment_reference: string
   payment_screenshot?: string
   subtotal: number
   shipping_cost: number
   total: number
   notes?: string
   created_at: string
   items: Array<{
     product_id: number
     product_name: string
     product_price: number
     quantity: number
     total: number
     variant_label?: string
   }>
  }>> {
   await requireAdmin()

   const result = await turso.execute({
     sql: `SELECT o.id, o.order_number, o.mode, o.status, o.email, o.phone, o.business_name, o.nit, o.first_name, o.last_name, o.address, o.city, o.department, o.payment_method, o.payment_reference, o.payment_screenshot, o.subtotal, o.shipping_cost, o.total, o.notes, o.created_at, oi.product_id, oi.product_name, oi.product_price, oi.quantity, oi.total as item_total, oi.variant_label FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id ORDER BY o.created_at DESC`,
   })

   const rows = (result as any).rows as any[]
   const ordersMap = new Map<number, any>()

   for (const row of rows) {
     if (!ordersMap.has(row.id)) {
       ordersMap.set(row.id, {
         id: row.id,
         order_number: row.order_number,
         mode: row.mode,
         status: row.status,
         email: row.email,
         phone: row.phone,
         business_name: row.business_name,
         nit: row.nit,
         first_name: row.first_name,
         last_name: row.last_name,
         address: row.address,
         city: row.city,
         department: row.department,
         payment_method: row.payment_method,
         payment_reference: row.payment_reference,
         payment_screenshot: row.payment_screenshot,
         subtotal: row.subtotal,
         shipping_cost: row.shipping_cost,
         total: row.total,
         notes: row.notes,
         created_at: row.created_at,
         items: [],
       })
     }

     if (row.product_id) {
       ordersMap.get(row.id)!.items.push({
         product_id: row.product_id,
         product_name: row.product_name,
         product_price: row.product_price,
         quantity: row.quantity,
         total: row.item_total,
         variant_label: row.variant_label,
       })
     }
   }

   return Array.from(ordersMap.values())
 }

 export async function updateOrderStatus(orderId: number, status: string): Promise<void> {

  await turso.execute({
    sql: `UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`,
    args: [status, new Date().toISOString(), orderId]
  })
}

// =============== OFERTAS ===============

async function loadOfertas() {
  const ofertas = await getOfertasFromCatalog()
  return ofertas.map((product: any) => ({
    ...product,
    isSale: product.is_sale,
    price: product.price,
    wholesalePrice: product.wholesale_price,
    originalPrice: product.original_price,
    stock: product.stock || product.product_stock || 0,
  }))
}

const getOfertas = unstable_cache(
  loadOfertas,
  ["ofertas"],
  { revalidate: 3600, tags: ["products"] }
)

function getOfferDiscount(originalPrice?: number | null, price?: number | null) {
  if (!originalPrice || !price || originalPrice <= 0) return 0
  return Math.max(0, Math.round((1 - price / originalPrice) * 100))
}

function getMaxOfferDiscount(products: any[]) {
  const discounts = products.map((product: any) => getOfferDiscount(product.originalPrice, product.price))

  for (const product of products) {
    const variantGroups = [product.variants || [], product.adultVariants || [], product.childVariants || []]
    for (const variants of variantGroups) {
      for (const variant of variants) {
        const originalPrice = variant.ofOriginalPrice ?? variant.originalPrice
        const price = variant.ofPrice ?? variant.price
        discounts.push(getOfferDiscount(originalPrice, price))
      }
    }
  }

  return Math.max(0, ...discounts)
}

export async function getOfertasPageData() {
  const ofertas = await getOfertasFromCatalog()
  const products = ofertas.map((product: any) => {
    const hasProductOffer = product.of_active || product.of_price || product.of_original_price || product.of_badge
    const productPrice = hasProductOffer && product.of_price ? product.of_price : product.price
    const productWholesalePrice = hasProductOffer && product.of_wholesale_price ? product.of_wholesale_price : (product.wholesale_price ?? product.wholesalePrice ?? product.price)

    return {
      ...product,
      isSale: !!hasProductOffer,
      price: productPrice,
      wholesalePrice: productWholesalePrice,
      originalPrice: product.of_original_price ?? product.original_price,
      stock: product.of_stock ?? product.product_stock ?? product.stock,
      badge: product.of_badge || product.badge,
      badge_color: product.of_badge_color || product.badge_color,
      ofActive: product.of_active ?? 0,
      ofPrice: product.of_price,
      ofWholesalePrice: product.of_wholesale_price,
      ofOriginalPrice: product.of_original_price,
      ofBadge: product.of_badge,
      ofBadgeColor: product.of_badge_color,
      ofStock: product.of_stock,
    }
  })

  return {
    products,
    maxDiscount: getMaxOfferDiscount(products),
  }
}

export async function getOfertasTableEntries() {
  await requireAdmin()
  const ofertas = await getOfertasFromCatalog()
  const entries: any[] = []

  for (const product of ofertas) {
    const hasProductOffer = product.is_sale || product.original_price || product.badge || product.of_active || product.of_price || product.of_original_price || product.of_badge

    if (hasProductOffer) {
      entries.push({
        id: product.id,
        product_id: product.id,
        variant_id: null,
        label: product.name,
        price: product.of_price ?? product.price,
        wholesale_price: product.of_wholesale_price ?? product.wholesale_price,
        original_price: product.of_original_price ?? product.original_price,
        stock: product.of_stock ?? product.product_stock ?? product.stock,
        badge: product.of_badge || product.badge || "OFERTA",
        badge_color: product.of_badge_color || product.badge_color || "bg-red-500",
        active: !!(product.of_active || product.is_sale),
      })
    }

    const variantGroups = [product.variants || [], product.adult_variants || [], product.child_variants || []]

    for (const variants of variantGroups) {
      for (const variant of variants) {
        const hasVariantOffer = variant.of_active || variant.of_price || variant.of_original_price || variant.of_stock || variant.of_badge || variant.badge
        if (!hasVariantOffer) continue

        entries.push({
          id: -Number(variant.id),
          product_id: product.id,
          variant_id: Number(variant.id),
          label: variant.label,
          price: variant.of_price ?? variant.price,
          wholesale_price: variant.of_wholesale_price ?? variant.wholesale_price,
          original_price: variant.of_original_price ?? variant.original_price,
          stock: variant.of_stock ?? variant.stock,
          badge: variant.of_badge || variant.badge || "OFERTA",
          badge_color: variant.of_badge_color || variant.badge_color || "bg-red-500",
          active: !!(variant.of_active || variant.of_price || variant.of_original_price || variant.of_badge),
        })
      }
    }
  }

  return entries
}

export async function upsertOfertaEntry(data: {
  productId: number
  variantId?: number | null
  price: number
  wholesalePrice: number
  originalPrice?: number | null
  stock: number
  badge?: string
  badgeColor?: string
  active?: boolean
}) {
  await requireAdmin()

  if (data.variantId) {
    const variantResult = await turso.execute({
      sql: `SELECT id FROM product_variants WHERE id = ?`,
      args: [data.variantId],
    })

    if (!(variantResult as any).rows.length) {
      throw new Error("Variante no encontrada")
    }

    await turso.execute({
      sql: `UPDATE product_variants SET of_price = ?, of_wholesale_price = ?, of_original_price = ?, of_stock = ?, of_badge = ?, of_badge_color = ?, of_active = ? WHERE id = ?`,
      args: [
        data.price,
        data.wholesalePrice,
        data.originalPrice ?? null,
        data.stock,
        data.badge || null,
        data.badgeColor || null,
        data.active !== false ? 1 : 0,
        data.variantId,
      ],
    })
  } else {
    const productResult = await turso.execute({
      sql: `SELECT price, wholesale_price, original_price, stock FROM products WHERE id = ?`,
      args: [data.productId],
    })
    const product = (productResult as any).rows[0]

    if (!product) {
      throw new Error("Producto no encontrado")
    }

    const originalPrice = data.originalPrice ?? product.original_price ?? data.price ?? null

    await turso.execute({
      sql: `UPDATE products SET of_price = ?, of_wholesale_price = ?, of_original_price = ?, of_stock = ?, of_badge = ?, of_badge_color = ?, of_active = ?, original_price = ?, badge = ?, badge_color = ?, is_sale = ? WHERE id = ?`,
      args: [
        data.price,
        data.wholesalePrice,
        originalPrice,
        data.stock,
        data.badge || null,
        data.badgeColor || null,
        data.active !== false ? 1 : 0,
        originalPrice,
        data.badge || null,
        data.badgeColor || null,
        data.active !== false ? 1 : 0,
        data.productId,
      ],
    })
  }

  invalidateProductCatalogCache()
}

export async function toggleOfertaEntryActive(id: number, active: boolean) {
  await requireAdmin()

  if (id > 0) {
    await turso.execute({
      sql: `UPDATE products SET of_active = ?, is_sale = ? WHERE id = ?`,
      args: [active ? 1 : 0, active ? 1 : 0, id],
    })
  } else {
    await turso.execute({
      sql: `UPDATE product_variants SET of_active = ? WHERE id = ?`,
      args: [active ? 1 : 0, -id],
    })
  }

  invalidateProductCatalogCache()
}

export async function deleteOfertaEntry(id: number) {
  await requireAdmin()

  if (id > 0) {
    await turso.execute({
      sql: `UPDATE products SET of_active = 0, of_price = NULL, of_wholesale_price = NULL, of_original_price = NULL, of_stock = 0, of_badge = NULL, of_badge_color = NULL, is_sale = 0, original_price = NULL, badge = NULL, badge_color = NULL WHERE id = ?`,
      args: [id],
    })
  } else {
    await turso.execute({
      sql: `UPDATE product_variants SET of_active = 0, of_price = NULL, of_wholesale_price = NULL, of_original_price = NULL, of_stock = 0, of_badge = NULL, of_badge_color = NULL WHERE id = ?`,
      args: [-id],
    })
  }

  invalidateProductCatalogCache()
}

export async function createOferta(productId: number, data: {
  price: number
  wholesalePrice: number
  originalPrice?: number
  stock: number
  badge?: string
  badgeColor?: string
  active?: boolean
}): Promise<void> {

  try {
    await turso.execute({
      sql: `UPDATE products SET of_price = ?, of_wholesale_price = ?, of_original_price = ?, of_stock = ?, of_badge = ?, of_badge_color = ?, of_active = ? WHERE id = ?`,
      args: [data.price, data.wholesalePrice, data.originalPrice || null, data.stock, data.badge || null, data.badgeColor || null, data.active !== false ? 1 : 0, productId]
    })
  } catch (e) {
    // Columns may not exist yet
  }

  await turso.execute({
    sql: `UPDATE products SET price = ?, wholesale_price = ?, original_price = ?, stock = ?, badge = ?, badge_color = ?, is_sale = ? WHERE id = ?`,
    args: [data.price, data.wholesalePrice, data.originalPrice || null, data.stock, data.badge || null, data.badgeColor || null, data.active !== false ? 1 : 0, productId]
  })
  invalidateProductCatalogCache()
}

export async function deleteOferta(productId: number): Promise<void> {

  try {
    await turso.execute({
      sql: `UPDATE products SET of_active = 0, of_price = NULL, of_wholesale_price = NULL, of_original_price = NULL, of_stock = 0, of_badge = NULL, of_badge_color = NULL WHERE id = ?`,
      args: [productId]
    })
  } catch (e) {
    // Columns may not exist yet
  }

  await turso.execute({
    sql: `UPDATE products SET is_sale = 0, original_price = NULL, badge = NULL, badge_color = NULL WHERE id = ?`,
    args: [productId]
  })
  invalidateProductCatalogCache()
}

export async function toggleOferta(productId: number, active: boolean): Promise<void> {

  await turso.execute({
    sql: `UPDATE products SET is_sale = ? WHERE id = ?`,
    args: [active ? 1 : 0, productId]
  })
  invalidateProductCatalogCache()
}

export async function updateOferta(productId: number, data: {
  price?: number
  wholesalePrice?: number
  originalPrice?: number
  stock?: number
  badge?: string
  badgeColor?: string
  active?: boolean
}): Promise<void> {

  // Only allowlisted column names may be interpolated into the SQL (defense in depth).
  const ALLOWED_COLUMNS = new Set([
    "price", "wholesale_price", "original_price", "stock", "badge", "badge_color", "is_sale",
  ])

  const assignments: Array<{ column: string; value: any }> = []

  if (data.price !== undefined) { assignments.push({ column: "price", value: data.price }) }
  if (data.wholesalePrice !== undefined) { assignments.push({ column: "wholesale_price", value: data.wholesalePrice }) }
  if (data.originalPrice !== undefined) { assignments.push({ column: "original_price", value: data.originalPrice }) }
  if (data.stock !== undefined) { assignments.push({ column: "stock", value: data.stock }) }
  if (data.badge !== undefined) { assignments.push({ column: "badge", value: data.badge }) }
  if (data.badgeColor !== undefined) { assignments.push({ column: "badge_color", value: data.badgeColor }) }
  if (data.active !== undefined) { assignments.push({ column: "is_sale", value: data.active ? 1 : 0 }) }

  const validAssignments = assignments.filter((a) => ALLOWED_COLUMNS.has(a.column))

  if (validAssignments.length > 0) {
    const setClause = validAssignments.map((a) => `${a.column} = ?`).join(", ")
    const args = validAssignments.map((a) => a.value)
    args.push(productId)
    await turso.execute({
      sql: `UPDATE products SET ${setClause} WHERE id = ?`,
      args
    })
  }
  invalidateProductCatalogCache()
}

export async function setOfertaVariantData(variantId: number, data: {
  price?: number
  wholesalePrice?: number
  originalPrice?: number
  stock?: number
  badge?: string
  badgeColor?: string
  active?: boolean
}): Promise<void> {

  const fieldsOf: string[] = []
  const argsOf: any[] = []

  if (data.price !== undefined) { fieldsOf.push('of_price = ?'); argsOf.push(data.price) }
  if (data.wholesalePrice !== undefined) { fieldsOf.push('of_wholesale_price = ?'); argsOf.push(data.wholesalePrice) }
  if (data.originalPrice !== undefined) { fieldsOf.push('of_original_price = ?'); argsOf.push(data.originalPrice) }
  if (data.stock !== undefined) { fieldsOf.push('of_stock = ?'); argsOf.push(data.stock) }
  if (data.badge !== undefined) { fieldsOf.push('of_badge = ?'); argsOf.push(data.badge) }
  if (data.badgeColor !== undefined) { fieldsOf.push('of_badge_color = ?'); argsOf.push(data.badgeColor) }
  if (data.active !== undefined) { fieldsOf.push('of_active = ?'); argsOf.push(data.active ? 1 : 0) }

  if (fieldsOf.length > 0) {
    fieldsOf.push('id = ?')
    argsOf.push(variantId)
    try {
      await turso.execute({
        sql: `UPDATE product_variants SET ${fieldsOf.join(', ')} WHERE id = ?`,
        args: argsOf
      })
    } catch (e) {
      // Columns may not exist yet
    }
  }

  const fields: string[] = []
  const args: any[] = []

  if (data.price !== undefined) { fields.push('price = ?'); args.push(data.price) }
  if (data.wholesalePrice !== undefined) { fields.push('wholesale_price = ?'); args.push(data.wholesalePrice) }
  if (data.originalPrice !== undefined) { fields.push('original_price = ?'); args.push(data.originalPrice) }
  if (data.stock !== undefined) { fields.push('stock = ?'); args.push(data.stock) }
  if (data.badge !== undefined) { fields.push('badge = ?'); args.push(data.badge) }
  if (data.badgeColor !== undefined) { fields.push('badge_color = ?'); args.push(data.badgeColor) }

  if (fields.length > 0) {
    fields.push('id = ?')
    args.push(variantId)
    await turso.execute({
      sql: `UPDATE product_variants SET ${fields.join(', ')} WHERE id = ?`,
      args
    })
  }
  invalidateProductCatalogCache()
}

export async function toggleVariantActive(variantId: number, active: boolean): Promise<void> {

  try {
    await turso.execute({
      sql: `UPDATE product_variants SET is_active = ? WHERE id = ?`,
      args: [active ? 1 : 0, variantId]
    })
  } catch (e) {
    // Column may not exist yet, fallback to of_active
    try {
      await turso.execute({
        sql: `UPDATE product_variants SET of_active = ? WHERE id = ?`,
        args: [active ? 1 : 0, variantId]
      })
    } catch (e2) {
      // Both columns may not exist
    }
  }
  invalidateProductCatalogCache()
}

export async function setVariantOferta(variantId: number, data: {
   active?: boolean
   price?: number
   wholesalePrice?: number
   originalPrice?: number
   stock?: number
   badge?: string
   badgeColor?: string
 }): Promise<void> {

   const fieldsOf: string[] = []
   const argsOf: any[] = []

   if (data.active !== undefined) { fieldsOf.push('of_active = ?'); argsOf.push(data.active ? 1 : 0) }
   if (data.price !== undefined) { fieldsOf.push('of_price = ?'); argsOf.push(data.price) }
   if (data.wholesalePrice !== undefined) { fieldsOf.push('of_wholesale_price = ?'); argsOf.push(data.wholesalePrice) }
   if (data.originalPrice !== undefined) { fieldsOf.push('of_original_price = ?'); argsOf.push(data.originalPrice) }
   if (data.stock !== undefined) { fieldsOf.push('of_stock = ?'); argsOf.push(data.stock) }
   if (data.badge !== undefined) { fieldsOf.push('of_badge = ?'); argsOf.push(data.badge) }
   if (data.badgeColor !== undefined) { fieldsOf.push('of_badge_color = ?'); argsOf.push(data.badgeColor) }

    if (fieldsOf.length > 0) {
      fieldsOf.push('id = ?')
      argsOf.push(variantId)
      try {
        await turso.execute({
          sql: `UPDATE product_variants SET ${fieldsOf.join(', ')} WHERE id = ?`,
          args: argsOf
        })
       } catch (e) {
         // Columns may not exist yet
       }
     }
   invalidateProductCatalogCache()
 }

export async function toggleProductActive(productId: number, active: boolean): Promise<void> {

  await turso.execute({
    sql: `UPDATE products SET is_active = ? WHERE id = ?`,
    args: [active ? 1 : 0, productId]
  })
  invalidateProductCatalogCache()
}

// =============== SERVER ACTIONS (reemplazan API routes) ===============

export async function adminLogin(password: string, username?: string): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña requeridos" }
  }

  const headersList = await headers()
  const clientIp = (headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headersList.get("x-real-ip")
    || "unknown")

  // Rate limit both by username and by client IP to prevent brute-forcing many accounts.
  if (!checkLoginRateLimit(`user:${username}`) || !checkLoginRateLimit(`ip:${clientIp}`)) {
    return { success: false, error: "Demasiados intentos. Intenta de nuevo en 1 minuto." }
  }


  const result = await turso.execute({
    sql: `SELECT id, password_hash, salt FROM admin_users WHERE username = ?`,
    args: [username]
  })

  const rows = result as any
  const user = rows?.rows?.[0]

  if (!user) {
    return { success: false, error: "Usuario no encontrado" }
  }

  const crypto = require("crypto")
  const storedHash = crypto.scryptSync(password, user.salt, 64).toString("hex")
  if (storedHash !== user.password_hash) {
    return { success: false, error: "Contraseña incorrecta" }
  }

  const cookieStore = (await cookies()) as any
  cookieStore.set(SESSION_COOKIE, String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return { success: true }
}

export async function createAdminUser(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña requeridos" }
  }

  const salt = randomBytes(16).toString("hex")
  const passwordHash = Buffer.from(require("crypto").scryptSync(password, salt, 64)).toString("hex")

  try {
    await turso.execute({
      sql: `INSERT INTO admin_users (username, password_hash, salt) VALUES (?, ?, ?)`,
      args: [username, passwordHash, salt]
    })
    return { success: true }
  } catch (e: any) {
    if (e.message?.includes("UNIQUE constraint failed")) {
      return { success: false, error: "El usuario ya existe" }
    }
    return { success: false, error: "Error al crear usuario" }
  }
}

export async function adminLogout() {
  const cookieStore = (await cookies()) as any
  cookieStore.delete(SESSION_COOKIE)
}

export async function adminGetProducts() {
  await requireAdmin()
  try {
    const products = await getProductsWithVariantsFromDB()
    const enriched = products.map((p: any) => ({
      ...p,
      ofertaActiva: p.of_active ?? p.is_sale ?? false,
    }))
    return { products: enriched }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { error: "Error al obtener productos" }
  }
}

export async function adminUpdateProduct(data: {
  id: number
  price: number
  wholesalePrice: number
  originalPrice?: number
  stock: number
  isNew: boolean
  isSale: boolean
  badge?: string
  badgeColor?: string
}) {
  await requireAdmin()
  try {
    await updateProductPrice(data.id, data.price, data.wholesalePrice, data.originalPrice)
    await updateProductStock(data.id, data.stock)
    await updateProductBadge(data.id, data.isNew, data.isSale, data.badge, data.badgeColor)
    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    return { error: "Error al actualizar producto" }
  }
}

export async function adminToggleProductActive(productId: number, active: boolean) {
  await requireAdmin()
  try {
    await toggleProductActive(productId, active)
    return { success: true }
  } catch (error) {
    console.error("Error toggling product active:", error)
    return { error: "Error al cambiar estado" }
  }
}

export async function adminDeleteProduct(productId: number) {
  await requireAdmin()
  try {
    await deleteProduct(productId)
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { error: "Error al eliminar producto" }
  }
}

export async function adminGetOrders() {
  await requireAdmin()
  try {
    const orders = await getAllOrders()
    return { orders }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { error: "Error al obtener ordenes" }
  }
}

export async function adminUpdateOrderStatus(orderId: number, status: string) {
  await requireAdmin()
  try {
    await updateOrderStatus(orderId, status)
    return { success: true }
  } catch (error) {
    console.error("Error updating order:", error)
    return { error: "Error al actualizar orden" }
  }
}

export async function adminUpdateVariant(data: {
  id: number
  price?: number
  wholesalePrice?: number
  stock?: number
  badge?: string
  badgeColor?: string
  active?: boolean
  of_active?: boolean
  of_price?: number
  of_wholesale_price?: number
  of_original_price?: number
  of_stock?: number
  of_badge?: string
  of_badge_color?: string
}) {
  await requireAdmin()
  try {
    if (data.active !== undefined) {
      await toggleVariantActive(data.id, data.active)
    }
    if (data.price !== undefined || data.wholesalePrice !== undefined) {
      await updateVariantPrice(data.id, data.price ?? 0, data.wholesalePrice ?? 0)
    }
    if (data.stock !== undefined) {
      await updateVariantStock(data.id, data.stock)
    }
    if (data.badge !== undefined || data.badgeColor !== undefined) {
      await updateVariantBadge(data.id, data.badge, data.badgeColor)
    }
    if (data.of_active !== undefined) {
      await setVariantOferta(data.id, {
        active: data.of_active,
        price: data.of_price,
        wholesalePrice: data.of_wholesale_price,
        originalPrice: data.of_original_price,
        stock: data.of_stock,
        badge: data.of_badge,
        badgeColor: data.of_badge_color,
      })
    }
    return { success: true }
  } catch (error) {
    console.error("Error updating variant:", error)
    return { error: "Error al actualizar variante" }
  }
}

export async function adminSetVariantOferta(variantId: number, data: {
  active?: boolean
  price?: number
  wholesalePrice?: number
  originalPrice?: number
  stock?: number
  badge?: string
  badgeColor?: string
}) {
  await requireAdmin()
  try {
    await setVariantOferta(variantId, data)
    return { success: true }
  } catch (error) {
    console.error("Error toggling variant oferta:", error)
    return { error: "Error al cambiar estado de oferta" }
  }
}

export async function updateVariant(variantId: number, data: {
  price?: number
  wholesalePrice?: number
  stock?: number
}) {
  await requireAdmin()
  try {
    if (data.price !== undefined || data.wholesalePrice !== undefined) {
      await updateVariantPrice(variantId, data.price ?? 0, data.wholesalePrice ?? 0)
    }
    if (data.stock !== undefined) {
      await updateVariantStock(variantId, data.stock)
    }
    return { success: true }
  } catch (error) {
    console.error("Error updating variant:", error)
    return { error: "Error al actualizar variante" }
  }
}

export async function getProductStockAction(productId: number): Promise<{ productId: number; stock: number }> {
  const result = await turso.execute({
    sql: `SELECT stock FROM products WHERE id = ?`,
    args: [productId]
  })
  const row = (result as any).rows[0]
  return { productId, stock: row ? row.stock : 0 }
}

export async function getAllProductsWithStockAction() {
  return getProductsWithStockCached()
}

export async function updateInventoryAction(data: {
  productId: number
  quantity: number
  action: "add" | "reduce" | "set"
}) {
  await requireAdmin()
  try {
    if (data.action === "add") {
      await addProductStock(data.productId, data.quantity)
      return { success: true, message: `Added ${data.quantity} units to product ${data.productId}` }
    } else if (data.action === "reduce") {
      const success = await reduceProductStock(data.productId, data.quantity)
      if (!success) {
        return { error: `Insufficient stock to reduce ${data.quantity} units` }
      }
      return { success: true, message: `Reduced ${data.quantity} units from product ${data.productId}` }
    } else if (data.action === "set") {
      await setProductStock(data.productId, data.quantity)
      return { success: true, message: `Set stock to ${data.quantity} units for product ${data.productId}` }
    }
    return { error: "Invalid action. Use 'add', 'reduce', or 'set'" }
  } catch (error: any) {
    console.error("Inventory action error:", error)
    return { error: "Failed to process inventory request", details: error.message }
  }
}
