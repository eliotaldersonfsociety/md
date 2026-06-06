"use server"

import { randomBytes } from "crypto"
import { Buffer } from "buffer"
import { cookies } from "next/headers"
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

let initialized = false
let cachedData: { ratings: Record<number, { avg: number; count: number }>; reviews: Record<number, any[]> } | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hora

async function initTables() {
  if (initialized) return
  initialized = true
  
  // Create tables (run once on first access after cold start)
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  })
  
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      wholesale_price REAL NOT NULL,
      original_price REAL,
      image TEXT,
      category_id INTEGER,
      is_new BOOLEAN DEFAULT FALSE,
      is_sale BOOLEAN DEFAULT FALSE,
      is_best_seller BOOLEAN DEFAULT FALSE,
      min_wholesale INTEGER DEFAULT 12,
      rating_sum INTEGER DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`
  })
  
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      username TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`
  })
  
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      price REAL NOT NULL,
      wholesale_price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      variant_type TEXT DEFAULT 'general',
      badge TEXT,
      badge_color TEXT,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`
  })
  
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      mode TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      business_name TEXT,
      nit TEXT,
      first_name TEXT,
      last_name TEXT,
      address TEXT,
      apartment TEXT,
      city TEXT,
      department TEXT,
      postal_code TEXT,
      payment_method TEXT NOT NULL,
      payment_reference TEXT,
      payment_screenshot TEXT,
      subtotal REAL NOT NULL,
      shipping_cost REAL DEFAULT 0,
      total REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  })
  
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      variant_label TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`
  })

  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  })

  try {
    await turso.execute({
      sql: `ALTER TABLE order_items ADD COLUMN variant_label TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN original_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN badge TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN badge_color TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN variant_type TEXT DEFAULT 'general'`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN badge TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN badge_color TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE reviews ADD COLUMN username TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE reviews ADD COLUMN avatar TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_wholesale_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_original_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_stock INTEGER DEFAULT 0`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_badge TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_badge_color TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN of_active BOOLEAN DEFAULT 0`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_wholesale_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_original_price REAL`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_stock INTEGER DEFAULT 0`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_badge TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_badge_color TEXT`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE product_variants ADD COLUMN of_active BOOLEAN DEFAULT 0`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT 1`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `ALTER TABLE admin_users ADD COLUMN active INTEGER DEFAULT 1`
    })
  } catch (e) {
    // Column already exists
  }

  try {
    await turso.execute({
      sql: `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    })
  } catch (e) {
    // Table already exists
  }
}

export async function rateProduct(productId: number, rating: number, comment?: string, username?: string, avatar?: string) {
  await initTables()

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
  cachedData = null

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

export async function getAllRatingsAndReviews() {
  // Check cache first
  const now = Date.now()
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData
  }
  
  await initTables()
  
  // Single query for all products with ratings
  const ratingsResult = await turso.execute({
    sql: `SELECT id, rating_sum, rating_count FROM products WHERE rating_count > 0`,
  })

  // Single query for all reviews
  const reviewsResult = await turso.execute({
    sql: `SELECT product_id, id, rating, comment, username, avatar, created_at FROM reviews ORDER BY created_at DESC LIMIT 500`,
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
    const imageId = ((id * 17 + Math.floor(id / 100)) % 90) + 1
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

  cachedData = { ratings, reviews: reviewsByProduct }
  cacheTimestamp = now
  return cachedData
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
}) {
  await initTables()
  const orderNumber = `${data.mode === "wholesale" ? "COT" : "PEL"}-${randomBytes(6).toString("hex").toUpperCase()}`

  const result = await turso.execute({
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

   // Process order items and reduce stock
   for (const item of data.items) {
     const variantLabel = item.variantLabel && item.variantLabel.trim() !== "" ? item.variantLabel : null
     
     let sufficientStock = false
     if (variantLabel) {
       sufficientStock = await reduceVariantStock(item.productId, variantLabel, item.quantity)
     } else {
       sufficientStock = await reduceProductStock(item.productId, item.quantity)
     }
     
     if (!sufficientStock) {
       throw new Error(`Insufficient stock for product ${item.productName}`)
     }
     
     await turso.execute({
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

  return { orderId, orderNumber }
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
    throw new Error("RESEND_API_KEY no configurada en el servidor")
  }
  
  try {
    const response = await fetch("https://api.resend.com/v1/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + resendApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Mundo Disney <noreply@mundodisney.com>",
        to: ["fabricadepeluchesmundodisney@gmail.com"],
        subject: "Nuevo contacto: " + data.subject,
        html: "<h2>Nuevo mensaje de contacto</h2><p><strong>Nombre:</strong> " + data.name + "</p><p><strong>Email:</strong> " + data.email + "</p><p><strong>Telefono:</strong> " + (data.phone || "No especificado") + "</p><p><strong>Asunto:</strong> " + data.subject + "</p><p><strong>Mensaje:</strong> " + data.message + "</p>"
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error("Resend API error:", result)
      throw new Error(result.message || "Error al enviar el email")
    }
    
    return { success: true }
  } catch (emailError) {
    console.error("Email send error:", emailError)
    throw emailError
  }
}

export async function getProductStock(productId: number): Promise<number> {
  await initTables()
  
  const result = await turso.execute({
    sql: `SELECT stock FROM products WHERE id = ?`,
    args: [productId]
  })
  
  const row = (result as any).rows[0]
  return row ? row.stock : 0
}

export async function addProductStock(productId: number, quantity: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE products SET stock = stock + ? WHERE id = ?`,
    args: [quantity, productId]
  })
}

export async function reduceProductStock(productId: number, quantity: number): Promise<boolean> {
  await initTables()
  
  // First check if we have enough stock
  const currentStock = await getProductStock(productId)
  if (currentStock < quantity) {
    return false // Not enough stock
  }
  
  await turso.execute({
    sql: `UPDATE products SET stock = stock - ? WHERE id = ?`,
    args: [quantity, productId]
  })
  
  return true
}

export async function setProductStock(productId: number, quantity: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE products SET stock = ? WHERE id = ?`,
    args: [quantity, productId]
  })
}

export async function getVariantsByProductId(productId: number): Promise<Array<{
  id: number
  product_id: number
  label: string
  price: number
  wholesale_price: number
  stock: number
}>> {
  await initTables()
  
  const result = await turso.execute({
    sql: `SELECT id, product_id, label, price, wholesale_price, stock FROM product_variants WHERE product_id = ?`,
    args: [productId]
  })
  
  return (result as any).rows
}

export async function seedProductsAndVariants(): Promise<void> {
  await initTables()

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
    { id: 101, name: "Peluche Milo Gato", price: 60000, originalPrice: 55000, image: "/images/peluches/1.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 60000 }, { label: "#3 - 60cm", price: 120000 }, { label: "#4 - 90cm", price: 150000 }], stock: 15 },
    { id: 102, name: "Peluche Mimi Gata", price: 60000, originalPrice: 72000, image: "/images/peluches/2.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 60000 }, { label: "#3 - 60cm", price: 120000 }, { label: "#4 - 90cm", price: 150000 }], stock: 25 },
    { id: 103, name: "Peluche Bubu Mono", price: 68000, originalPrice: 85000, image: "/images/peluches/3.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 48000 }, { label: "#3 - 60cm", price: 68000 }, { label: "#4 - 90cm", price: 88000 }], stock: 18 },
    { id: 104, name: "Peluche Lala Mona", price: 55000, image: "/images/peluches/4.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 40000 }, { label: "#3 - 60cm", price: 55000 }, { label: "#4 - 90cm", price: 75000 }], stock: 22 },
    { id: 105, name: "Peluche Dodo Conejo", price: 48000, image: "/images/peluches/5.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 36000 }, { label: "#3 - 60cm", price: 48000 }, { label: "#4 - 90cm", price: 68000 }], stock: 30 },
    { id: 106, name: "Peluche Buny Coneja", price: 42000, originalPrice: 50000, image: "/images/peluches/6.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 12 },
    { id: 107, name: "Peluche Max Perro", price: 42000, originalPrice: 50000, image: "/images/peluches/7.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 14 },
    { id: 108, name: "Peluche Kira Perra", price: 42000, originalPrice: 50000, image: "/images/peluches/8.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 16 },
    { id: 109, name: "Peluche Roco Toro", price: 42000, originalPrice: 50000, image: "/images/peluches/9.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 11 },
    { id: 110, name: "Peluche Mura Vaca", price: 42000, originalPrice: 50000, image: "/images/peluches/10.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 13 },
    { id: 111, name: "Peluche Nube Oveja", price: 42000, originalPrice: 50000, image: "/images/peluches/11.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 17 },
    { id: 112, name: "Peluche Kimi Oveja", price: 42000, originalPrice: 50000, image: "/images/peluches/12.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 12 },
    { id: 113, name: "Peluche Gino Jirafa", price: 42000, originalPrice: 50000, image: "/images/peluches/13.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 10 },
    { id: 114, name: "Peluche Jira Jirafa", price: 42000, originalPrice: 50000, image: "/images/peluches/14.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 8 },
    { id: 115, name: "Peluche Drako Dragon", price: 42000, originalPrice: 50000, image: "/images/peluches/15.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 14 },
    { id: 116, name: "Peluche Drini Dragon", price: 42000, originalPrice: 50000, image: "/images/peluches/16.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 50000 }, { label: "#3 - 60cm", price: 100000 }, { label: "#4 - 100cm", price: 150000 }], stock: 19 },
    { id: 117, name: "Peluche Orejon Conejo Nino", price: 42000, originalPrice: 50000, image: "/images/peluches/17.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 20 },
    { id: 118, name: "Peluche Orejon Coneja Nina", price: 42000, originalPrice: 50000, image: "/images/peluches/18.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 16 },
    { id: 119, name: "Peluche Orejon Perro Nino", price: 42000, originalPrice: 50000, image: "/images/peluches/19.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 18 },
    { id: 120, name: "Peluche Orejon Perra Nina", price: 42000, originalPrice: 50000, image: "/images/peluches/20.webp", category: "peluches", variants: [{ label: "#2 - 40cm", price: 32000 }, { label: "#3 - 60cm", price: 42000 }, { label: "#4 - 90cm", price: 62000 }], stock: 11 },
    // Cojines
    { id: 201, name: "Cojin Corazon Lo Lograstes", price: 35000, originalPrice: 42000, image: "/images/cojines/1.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 20 },
    { id: 202, name: "Cojin Corazon Felicitaciones", price: 38000, image: "/images/cojines/2.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 28 },
    { id: 203, name: "Cojin Corazon Feliz Dia Mama", price: 32000, image: "/images/cojines/3.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 35 },
    { id: 204, name: "Cojin Corazon Me Gustas", price: 45000, image: "/images/cojines/4.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 26 },
    { id: 205, name: "Cojin Corazon Me Gustas", price: 42000, originalPrice: 50000, image: "/images/cojines/5.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 22 },
    { id: 206, name: "Cojin Corazon Te Amo", price: 48000, image: "/images/cojines/6.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 18 },
    { id: 207, name: "Cojin Corazon Te Quiero", price: 48000, image: "/images/cojines/7.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 24 },
    { id: 208, name: "Cojin Corazon Feliz Dia", price: 48000, image: "/images/cojines/8.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 19 },
    { id: 209, name: "Cojin Corazon TQM", price: 48000, image: "/images/cojines/9.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 17 },
    { id: 210, name: "Cojin Corazon Eres Especial", price: 48000, image: "/images/cojines/10.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 21 },
    { id: 211, name: "Cojin Corazon Feliz Cumpleanos", price: 48000, image: "/images/cojines/11.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 15 },
    { id: 212, name: "Cojin Corazon Te ExtraNo", price: 48000, image: "/images/cojines/12.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 13 },
    { id: 2120, name: "Cojin Corazon Eres Tu", price: 48000, image: "/images/cojines/17.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 10 },
    { id: 2121, name: "Cojin Corazon Eres mi Felicidad", price: 48000, image: "/images/cojines/18.webp", category: "cojines", variants: [{ label: "Pequeno - 25cm", price: 15000 }, { label: "Grande - 35cm", price: 22000 }], stock: 14 },
    { id: 213, name: "Cojin Cuadrado Portugal", price: 48000, image: "/images/cojines/13.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 22000 }], stock: 25 },
    { id: 214, name: "Cojin Cuadrado Argentina", price: 48000, image: "/images/cojines/14.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 22000 }], stock: 28 },
    { id: 215, name: "Cojin Cuadrado Colombia", price: 48000, image: "/images/cojines/15.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 22000 }], stock: 22 },
    { id: 216, name: "Cojin Cuadrado Brasil", price: 48000, image: "/images/cojines/16.webp", category: "cojines", variants: [{ label: "Grande - 35cm", price: 22000 }], stock: 30 },
    // Latas
    { id: 301, name: "Lata Te ExtraNo", price: 18000, image: "/images/lata/2.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 45 },
    { id: 302, name: "Lata Me Gustas", price: 18000, originalPrice: 28000, image: "/images/lata/4.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 38 },
    { id: 303, name: "Lata TQM", price: 18000, image: "/images/lata/5.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 52 },
    { id: 304, name: "Lata Te Amo", price: 18000, image: "/images/lata/7.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 28 },
    { id: 305, name: "Lata Felicitaciones", price: 26000, originalPrice: 32000, image: "/images/lata/6.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 26000 }], stock: 34 },
    { id: 306, name: "Lata Los Simpsons", price: 23000, image: "/images/lata/3.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 23000 }], stock: 40 },
    { id: 307, name: "Lata Futbol Portugal", price: 23000, image: "/images/lata/8.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 23000 }], stock: 36 },
    { id: 308, name: "Lata Futbol Colombia", price: 23000, image: "/images/lata/1.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 23000 }], stock: 42 },
    { id: 309, name: "Lata Futbol Brasil", price: 23000, image: "/images/lata/9.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 23000 }], stock: 48 },
    { id: 310, name: "Lata Futbol Argentina", price: 18000, image: "/images/lata/10.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 32 },
    { id: 311, name: "Lata Futbol Barcelona", price: 18000, image: "/images/lata/11.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 38 },
    { id: 312, name: "Lata Futbol Barcelona", price: 18000, image: "/images/lata/12.webp", category: "latas", variants: [{ label: "Mediano - 30cm", price: 18000 }], stock: 26 },
    // Cervicales
    { id: 401, name: "Cervical Futbol Brasil", price: 15000, originalPrice: 20000, image: "/images/cervicales/1.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 45 },
    { id: 402, name: "Cervical Futbol Colombia", price: 15000, image: "/images/cervicales/2.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 55 },
    { id: 403, name: "Cervical Futbol Argentina", price: 15000, originalPrice: 15000, image: "/images/cervicales/3.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 32 },
    { id: 404, name: "Cervical Futbol Real Madrid", price: 15000, image: "/images/cervicales/4.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 40 },
    { id: 405, name: "Cervical Futbol Portugal", price: 15000, originalPrice: 58000, image: "/images/cervicales/5.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }], stock: 38 },
    { id: 406, name: "Cervical Te Quiero", price: 18000, image: "/images/cervicales/6.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 50 },
    { id: 407, name: "Cervical Feliz Dia Mama", price: 18000, image: "/images/cervicales/7.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 45 },
    { id: 408, name: "Cervical TQM", price: 18000, image: "/images/cervicales/8.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 60 },
    { id: 409, name: "Cervical Eres Especial", price: 18000, image: "/images/cervicales/9.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 40 },
    { id: 410, name: "Cervical Eres Especial", price: 18000, image: "/images/cervicales/10.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 35 },
    { id: 411, name: "Cervical Lo Lograstes", price: 18000, image: "/images/cervicales/11.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 48 },
    { id: 412, name: "Cervical Felicitaciones", price: 18000, image: "/images/cervicales/12.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 38 },
    { id: 413, name: "Cervical Feliz Dia", price: 18000, image: "/images/cervicales/13.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 42 },
    { id: 414, name: "Cervical Bienvenido a la Familia", price: 18000, image: "/images/cervicales/14.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 44 },
    { id: 415, name: "Cervical Me Gustas", price: 18000, image: "/images/cervicales/15.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 52 },
    { id: 416, name: "Cervical Feliz Cumple AOs", price: 18000, image: "/images/cervicales/16.webp", category: "cervicales", variants: [{ label: "Con Antifaz", price: 25000 }], stock: 36 },
    { id: 417, name: "Cervical Te Amo", price: 18000, image: "/images/cervicales/17.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 46 },
    { id: 418, name: "Cervical Futbol Barcelona", price: 15000, originalPrice: 58000, image: "/images/cervicales/18.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }], stock: 28 },
    { id: 419, name: "Cervical Eres Tu", price: 18000, image: "/images/cervicales/20.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 48 },
    { id: 420, name: "Cervical Mi Felicidad", price: 18000, image: "/images/cervicales/20.webp", category: "cervicales", variants: [{ label: "Sin Antifaz", price: 20000 }, { label: "Con Antifaz", price: 25000 }], stock: 55 },
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
}

export async function upsertProductVariants(productId: number, variants: Array<{
  label: string
  price: number
  wholesalePrice: number
  stock: number
}>): Promise<void> {
  await initTables()

  for (const v of variants) {
    const existing = await turso.execute({
      sql: `SELECT id FROM product_variants WHERE product_id = ? AND label = ?`,
      args: [productId, v.label]
    })

    if ((existing as any).rows.length === 0) {
      await turso.execute({
        sql: `INSERT INTO product_variants (product_id, label, price, wholesale_price, stock) VALUES (?, ?, ?, ?, ?)`,
        args: [productId, v.label, v.price, v.wholesalePrice, v.stock]
      })
    }
  }
}

function normalizeLabel(label: string): string {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export async function getVariantStock(productId: number, variantLabel: string): Promise<number> {
  await initTables()
  
  const normalized = normalizeLabel(variantLabel)
  const result = await turso.execute({
    sql: `SELECT label, stock FROM product_variants WHERE product_id = ?`,
    args: [productId]
  })
  
  const rows = (result as any).rows as any[]
  for (const row of rows) {
    if (normalizeLabel(row.label) === normalized) {
      return row.stock
    }
  }
  
  const directResult = await turso.execute({
    sql: `SELECT stock FROM product_variants WHERE product_id = ? AND label = ?`,
    args: [productId, variantLabel]
  })
  const directRow = (directResult as any).rows[0]
  return directRow ? directRow.stock : 0
}

export async function reduceVariantStock(productId: number, variantLabel: string, quantity: number): Promise<boolean> {
  await initTables()
  
  const currentStock = await getVariantStock(productId, variantLabel)
  if (currentStock < quantity) {
    return false
  }
  
  const normalized = normalizeLabel(variantLabel)
  const result = await turso.execute({
    sql: `SELECT label FROM product_variants WHERE product_id = ?`,
    args: [productId]
  })
  const rows = (result as any).rows as any[]
  const exactLabel = rows.find((row: any) => normalizeLabel(row.label) === normalized)?.label ?? variantLabel
  
  await turso.execute({
    sql: `UPDATE product_variants SET 
          stock = CASE WHEN of_active != 1 THEN stock - ? ELSE stock END,
          of_stock = CASE WHEN of_active = 1 THEN of_stock - ? ELSE of_stock END
          WHERE product_id = ? AND label = ?`,
    args: [quantity, quantity, productId, exactLabel]
  })
  
  return true
}

export async function getProductsWithStock(): Promise<Array<{ 
  id: number, 
  name: string, 
  stock: number,
  price: number,
  wholesale_price: number,
  image: string,
  category_id: number
}>> {
  await initTables()
  
  const result = await turso.execute({
    sql: `SELECT id, name, stock, price, wholesale_price, image, category_id FROM products ORDER BY name`
  })
  
  return (result as any).rows
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
  await initTables()

   let sql = `
   SELECT 
          p.id, p.name, p.price, p.wholesale_price, p.original_price, p.image,
          p.category_id, p.is_new, p.is_sale, p.min_wholesale, p.rating_sum, p.rating_count, p.is_active,
          c.name as category,
          pv.id as variant_id, pv.label as variant_label, pv.price as variant_price,
          pv.wholesale_price as variant_wholesale, pv.stock as variant_stock,
          pv.variant_type, pv.badge as variant_badge, pv.badge_color as variant_badge_color,
          pv.of_active, pv.of_price, pv.of_wholesale_price, pv.of_original_price, pv.of_stock, pv.of_badge, pv.of_badge_color
         FROM products p
         INNER JOIN product_variants pv ON p.id = pv.product_id
         LEFT JOIN categories c ON p.category_id = c.id
      `

  const args: any[] = []
  if (categorySlug) {
    sql += ` WHERE c.slug = ? `
    args.push(categorySlug)
  }

  sql += ` ORDER BY p.id, pv.id`

  const result = await turso.execute({ sql, args })

  const rows = (result as any).rows as any[]
  const productMap = new Map<number, any>()

  for (const row of rows) {
    if (!productMap.has(row.id)) {
      productMap.set(row.id, {
        id: row.id,
        name: row.name,
        price: row.price,
        wholesale_price: row.wholesale_price,
        original_price: row.original_price,
        image: row.image,
        images: [],
        category_id: row.category_id,
        category: row.category,
        is_new: row.is_new,
        is_sale: row.is_sale,
        is_active: row.is_active ?? 1,
        min_wholesale: row.min_wholesale ?? 12,
        rating: row.rating_count > 0 ? row.rating_sum / row.rating_count : 4.5,
        reviews: row.rating_count || 0,
        features: ["Suavidad", "Relleno antialergico", "Durabilidad", "Facil lavado"],
        stock: 0,
        badge: row.is_new ? "Nuevo" : (row.is_sale ? "Oferta" : undefined),
        badge_color: row.is_new ? "bg-green-500" : undefined,
        variants: [],
        adult_variants: [],
        child_variants: [],
        adult_images: [],
        child_images: [],
      })
    }

const product = productMap.get(row.id)!

    // Skip if no variant or if variant already added
    if (!row.variant_id) continue

    // Check if variant already exists to avoid duplicates
    const existingVariant = product.variants?.find((v: any) => v.id === String(row.variant_id)) ||
                          product.adult_variants?.find((v: any) => v.id === String(row.variant_id)) ||
                          product.child_variants?.find((v: any) => v.id === String(row.variant_id))
    if (existingVariant) continue

    const variantEntry = {
      id: String(row.variant_id),
      label: row.variant_label,
      price: row.variant_price ?? row.price,
      wholesale_price: row.variant_wholesale ?? row.wholesale_price,
      stock: row.variant_stock ?? 0,
      badge: row.variant_badge,
      badge_color: row.variant_badge_color,
      of_active: row.of_active ?? 0,
      of_price: row.of_price,
      of_wholesale_price: row.of_wholesale_price,
      of_original_price: row.of_original_price,
      of_badge: row.of_badge,
      of_badge_color: row.of_badge_color,
    }
    product.stock += variantEntry.stock

    if (row.variant_type === 'adult') {
      product.adult_variants!.push(variantEntry)
    } else if (row.variant_type === 'child') {
      product.child_variants!.push(variantEntry)
    } else {
      product.variants!.push(variantEntry)
    }
  }

  return Array.from(productMap.values())
}

export async function updateProductPrice(productId: number, price: number, wholesalePrice: number, originalPrice?: number): Promise<void> {
  await initTables()
  
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
}

export async function updateProductStock(productId: number, stock: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE products SET stock = ? WHERE id = ?`,
    args: [stock, productId]
  })
}

export async function updateProductBadge(productId: number, isNew: boolean, isSale: boolean, badge?: string, badgeColor?: string): Promise<void> {
  await initTables()
  const ofActive = isSale ? 1 : 0
  await turso.execute({
    sql: `UPDATE products SET is_new = ?, is_sale = ?, badge = ?, badge_color = ?, of_active = ? WHERE id = ?`,
    args: [isNew ? 1 : 0, ofActive, badge || null, badgeColor || null, ofActive, productId]
  })
}

export async function updateVariantBadge(variantId: number, badge?: string, badgeColor?: string): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE product_variants SET badge = ?, badge_color = ? WHERE id = ?`,
    args: [badge || null, badgeColor || null, variantId]
  })
}

export async function updateVariantPrice(variantId: number, price: number, wholesalePrice: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE product_variants SET price = ?, wholesale_price = ? WHERE id = ?`,
    args: [price, wholesalePrice, variantId]
  })
}

export async function updateVariantStock(variantId: number, stock: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `UPDATE product_variants SET stock = ? WHERE id = ?`,
    args: [stock, variantId]
  })
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
  await initTables()
  
  const categoryResult = await turso.execute({
    sql: `SELECT id FROM categories WHERE slug = ?`,
    args: [data.category]
  })
  
  const categoryRow = (categoryResult as any).rows[0]
  if (!categoryRow) {
    throw new Error(`Category ${data.category} not found`)
  }
  
  const result = await turso.execute({
    sql: `SELECT p.id, p.name, p.price, p.wholesale_price, p.original_price, p.image, p.category_id, p.is_new, p.is_sale, p.stock, p.badge, p.badge_color, c.name as category, pv.id as variant_id, pv.label as variant_label, pv.price as variant_price, pv.wholesale_price as variant_wholesale, pv.stock as variant_stock, pv.badge as variant_badge, pv.badge_color as variant_badge_color, pv.variant_type, pv.is_active as variant_is_active        FROM products p
       INNER JOIN product_variants pv ON p.id = pv.product_id
       LEFT JOIN categories c ON p.category_id = c.id`
  })
  
  return Number((result as any).lastInsertRowid)
}

export async function deleteProduct(productId: number): Promise<void> {
  await initTables()
  
  await turso.execute({
    sql: `DELETE FROM products WHERE id = ?`,
    args: [productId]
  })
}

export async function createVariant(productId: number, data: {
  label: string
  price: number
  wholesalePrice: number
  stock: number
  variantType?: string
}): Promise<number> {
  await initTables()
  
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
  await initTables()

  const ordersResult = await turso.execute({
    sql: `SELECT * FROM orders ORDER BY created_at DESC`
  })

  const orders = (ordersResult as any).rows

  const ordersWithItems = await Promise.all(
    orders.map(async (order: any) => {
      const itemsResult = await turso.execute({
        sql: `SELECT product_id, product_name, product_price, quantity, total, variant_label FROM order_items WHERE order_id = ?`,
        args: [order.id]
      })

      return {
        ...order,
        items: (itemsResult as any).rows
      }
    })
  )

  return ordersWithItems
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await initTables()

  await turso.execute({
    sql: `UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`,
    args: [status, new Date().toISOString(), orderId]
  })
}

// =============== OFERTAS ===============

export async function getOfertas(): Promise<Array<{
   id: number
   name: string
   image: string
   category: string
   is_new?: boolean
   badge?: string
   badge_color?: string
   rating?: number
   reviews?: number
   features?: string[]
   stock: number
   isSale?: boolean
   price: number
   wholesalePrice: number
   originalPrice?: number
   variants?: Array<{
     id: string
     label: string
     price: number
     wholesale_price: number
     stock: number
     badge?: string
     badge_color?: string
     is_active?: boolean
     of_active?: boolean
     of_price?: number
     of_wholesale_price?: number
     of_original_price?: number
     of_stock?: number
   }>
   adult_variants?: Array<{
     id: string
     label: string
     price: number
     wholesale_price: number
     stock: number
     badge?: string
     badge_color?: string
     is_active?: boolean
     of_active?: boolean
     of_price?: number
     of_original_price?: number
   }>
   child_variants?: Array<{
     id: string
     label: string
     price: number
     wholesale_price: number
     stock: number
     badge?: string
     badge_color?: string
     is_active?: boolean
     of_active?: boolean
     of_price?: number
     of_original_price?: number
   }>
}>> {
  await initTables()

const queryResult = await turso.execute({
    sql: `
      SELECT p.id, p.name, p.image, c.name as category, p.is_new, p.badge, p.badge_color, p.is_active,
             p.rating_sum, p.rating_count, p.stock, p.is_sale,
             p.price, p.wholesale_price, p.original_price,
             pv.id as variant_id, pv.label as variant_label, pv.price as variant_price,
             pv.wholesale_price as variant_wholesale, pv.stock as variant_stock,
             pv.badge as variant_badge, pv.badge_color as variant_badge_color,
             pv.variant_type, pv.of_active, pv.of_price, pv.of_wholesale_price, pv.of_original_price, pv.of_stock, pv.of_badge, pv.of_badge_color
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id AND (pv.of_active = 1 OR pv.of_price IS NOT NULL OR pv.badge IS NOT NULL)
      WHERE EXISTS (
        SELECT 1 FROM product_variants pv2 WHERE pv2.product_id = p.id AND (pv2.of_active = 1 OR pv2.of_price IS NOT NULL OR pv2.badge IS NOT NULL)
      ) AND p.is_active = 1
      ORDER BY p.id, pv.id
    `
  })

  const rows = (queryResult as any).rows as any[]
  const productMap = new Map<number, any>()

  for (const row of rows) {
    // Skip rows that have no variant and no product offer
    if (!row.variant_id && !row.is_sale && !row.original_price) continue

    if (!productMap.has(row.id)) {
      productMap.set(row.id, {
        id: row.id,
        name: row.name,
        image: row.image,
        category: row.category,
        is_new: row.is_new,
        is_active: row.is_active ?? 1,
        badge: row.badge,
        badge_color: row.badge_color,
        rating: row.rating_count > 0 ? row.rating_sum / row.rating_count : 4.5,
        reviews: row.rating_count || 0,
        features: ["Suavidad", "Relleno antialergico", "Durabilidad", "Facil lavado"],
        stock: row.stock || 0,
        isSale: row.is_sale,
        price: row.price,
        wholesalePrice: row.wholesale_price,
        originalPrice: row.original_price,
        variants: [],
        adult_variants: [],
        child_variants: [],
      })
    }

    const product = productMap.get(row.id)!

    // Skip if no variant (we already added the product if it has offer)
    if (!row.variant_id) continue

    // Check if variant already exists to avoid duplicates
    const existingVariant = product.variants?.find((v: any) => v.id === String(row.variant_id)) ||
                          product.adult_variants?.find((v: any) => v.id === String(row.variant_id)) ||
                          product.child_variants?.find((v: any) => v.id === String(row.variant_id))
    if (existingVariant) continue

    // Check if variant has offer
    if (!row.of_active && !row.of_price && !row.variant_badge) continue

    const variantEntry = {
      id: String(row.variant_id),
      label: row.variant_label,
      price: row.variant_price,
      wholesale_price: row.variant_wholesale,
      stock: row.variant_stock ?? 0,
      badge: row.variant_badge,
      badge_color: row.variant_badge_color,
      is_active: true,
      of_active: row.of_active ?? 0,
      of_price: row.of_price,
      of_wholesale_price: row.of_wholesale_price,
      of_original_price: row.of_original_price,
      of_badge: row.of_badge,
      of_badge_color: row.of_badge_color,
    }

    if (row.variant_type === 'adult') {
      product.adult_variants.push(variantEntry)
    } else if (row.variant_type === 'child') {
      product.child_variants.push(variantEntry)
    } else {
      product.variants.push(variantEntry)
    }
  }

  // Filter products that have at least one offer (product or variant)
  const filtered = Array.from(productMap.values()).filter(p => 
    p.isSale || p.originalPrice || p.variants?.length || p.adult_variants?.length || p.child_variants?.length
  )

  return filtered
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
  await initTables()

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
}

export async function deleteOferta(productId: number): Promise<void> {
  await initTables()

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
}

export async function toggleOferta(productId: number, active: boolean): Promise<void> {
  await initTables()

  await turso.execute({
    sql: `UPDATE products SET is_sale = ? WHERE id = ?`,
    args: [active ? 1 : 0, productId]
  })
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
  await initTables()

  const fields: string[] = []
  const args: any[] = []

  if (data.price !== undefined) { fields.push('price = ?'); args.push(data.price) }
  if (data.wholesalePrice !== undefined) { fields.push('wholesale_price = ?'); args.push(data.wholesalePrice) }
  if (data.originalPrice !== undefined) { fields.push('original_price = ?'); args.push(data.originalPrice) }
  if (data.stock !== undefined) { fields.push('stock = ?'); args.push(data.stock) }
  if (data.badge !== undefined) { fields.push('badge = ?'); args.push(data.badge) }
  if (data.badgeColor !== undefined) { fields.push('badge_color = ?'); args.push(data.badgeColor) }
  if (data.active !== undefined) { fields.push('is_sale = ?'); args.push(data.active ? 1 : 0) }

  if (fields.length > 0) {
    fields.push('id = ?')
    args.push(productId)
    await turso.execute({
      sql: `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      args
    })
  }
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
  await initTables()

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
}

export async function toggleVariantActive(variantId: number, active: boolean): Promise<void> {
  await initTables()

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
   await initTables()

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
  }

export async function toggleProductActive(productId: number, active: boolean): Promise<void> {
  await initTables()

  await turso.execute({
    sql: `UPDATE products SET is_active = ? WHERE id = ?`,
    args: [active ? 1 : 0, productId]
  })
}

// =============== SERVER ACTIONS (reemplazan API routes) ===============

export async function adminLogin(password: string, username?: string): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña requeridos" }
  }

  await initTables()

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

  await initTables()
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
  await initTables()
  const result = await turso.execute({
    sql: `SELECT stock FROM products WHERE id = ?`,
    args: [productId]
  })
  const row = (result as any).rows[0]
  return { productId, stock: row ? row.stock : 0 }
}

export async function getAllProductsWithStockAction() {
  await initTables()
  const result = await turso.execute({
    sql: `SELECT id, name, stock, price, wholesale_price, image, category_id FROM products ORDER BY name`
  })
  return (result as any).rows
}

export async function updateInventoryAction(data: {
  productId: number
  quantity: number
  action: "add" | "reduce" | "set"
}) {
  requireAdmin()
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