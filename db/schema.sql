-- Schema para Turso Database - Peluches Mundo Disney

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
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
  badge TEXT,
  badge_color TEXT,
  is_active BOOLEAN DEFAULT 1,
  of_price REAL,
  of_wholesale_price REAL,
  of_original_price REAL,
  of_stock INTEGER DEFAULT 0,
  of_badge TEXT,
  of_badge_color TEXT,
  of_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de órdenes/compras
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('retail', 'wholesale')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  
  -- Información de contacto
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Información de negocio (mayoreo)
  business_name TEXT,
  nit TEXT,
  
  -- Dirección de envío
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  apartment TEXT,
  city TEXT,
  department TEXT,
  postal_code TEXT,
  
  -- Información de pago
  payment_method TEXT NOT NULL CHECK (payment_method IN ('daviplata', 'paypal', 'nequi', 'bancolombia', 'binance', 'zelle')),
  payment_reference TEXT,
  payment_screenshot TEXT,
  
  -- Totales
  subtotal REAL NOT NULL,
  shipping_cost REAL DEFAULT 0,
  total REAL NOT NULL,
  
  -- Notas
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
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
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  price REAL NOT NULL,
  wholesale_price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  variant_type TEXT DEFAULT 'general',
  badge TEXT,
  badge_color TEXT,
  is_active BOOLEAN DEFAULT 1,
  of_price REAL,
  of_wholesale_price REAL,
  of_original_price REAL,
  of_stock INTEGER DEFAULT 0,
  of_badge TEXT,
  of_badge_color TEXT,
  of_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(product_id, label)
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);