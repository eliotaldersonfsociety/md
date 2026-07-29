import { turso } from "./index"

export async function runMigrations() {
  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
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
    )`,
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
    )`,
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
    )`,
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
    )`,
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
    )`,
  })

  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  })

  await turso.execute({
    sql: `CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  })

  const alterColumns = [
    { table: "order_items", column: "variant_label", type: "TEXT" },
    { table: "products", column: "original_price", type: "REAL" },
    { table: "products", column: "stock", type: "INTEGER DEFAULT 0" },
    { table: "products", column: "badge", type: "TEXT" },
    { table: "products", column: "badge_color", type: "TEXT" },
    { table: "product_variants", column: "variant_type", type: "TEXT DEFAULT 'general'" },
    { table: "product_variants", column: "badge", type: "TEXT" },
    { table: "product_variants", column: "badge_color", type: "TEXT" },
    { table: "reviews", column: "username", type: "TEXT" },
    { table: "reviews", column: "avatar", type: "TEXT" },
    { table: "products", column: "of_price", type: "REAL" },
    { table: "products", column: "of_wholesale_price", type: "REAL" },
    { table: "products", column: "of_original_price", type: "REAL" },
    { table: "products", column: "of_stock", type: "INTEGER DEFAULT 0" },
    { table: "products", column: "of_badge", type: "TEXT" },
    { table: "products", column: "of_badge_color", type: "TEXT" },
    { table: "products", column: "of_active", type: "BOOLEAN DEFAULT 0" },
    { table: "product_variants", column: "of_price", type: "REAL" },
    { table: "product_variants", column: "of_wholesale_price", type: "REAL" },
    { table: "product_variants", column: "of_original_price", type: "REAL" },
    { table: "product_variants", column: "of_stock", type: "INTEGER DEFAULT 0" },
    { table: "product_variants", column: "of_badge", type: "TEXT" },
    { table: "product_variants", column: "of_badge_color", type: "TEXT" },
    { table: "product_variants", column: "of_active", type: "BOOLEAN DEFAULT 0" },
    { table: "products", column: "is_active", type: "BOOLEAN DEFAULT 1" },
    { table: "admin_users", column: "active", type: "INTEGER DEFAULT 1" },
  ]

  for (const col of alterColumns) {
    try {
      await turso.execute({
        sql: `ALTER TABLE ${col.table} ADD COLUMN ${col.column} ${col.type}`,
      })
    } catch {
      // Column already exists
    }
  }

  await turso.execute({
    sql: `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`,
  })

  await turso.execute({
    sql: `CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id)`,
  })

  await turso.execute({
    sql: `CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`,
  })

  await turso.execute({
    sql: `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
  })

  await turso.execute({
    sql: `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)`,
  })
}
