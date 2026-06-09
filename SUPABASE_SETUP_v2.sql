-- ============================================================================
-- SUPABASE SETUP - ARQUITECTURA EMPRESARIAL (v2.0)
-- ============================================================================
-- Estructura mejorada con producer_profiles y buyer_profiles
-- Ejecuta estos comandos en la consola SQL de Supabase

-- ============================================================================
-- 1. TABLA BASE: users (Autenticación)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'producer', 'buyer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. TABLA: producer_profiles (Perfil específico de Productores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS producer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Información del negocio
  business_name TEXT NOT NULL,
  description TEXT,
  specialty TEXT, -- ej: "Vegetales orgánicos", "Lácteos artesanales"
  
  -- Ubicación y servicio
  area TEXT, -- ej: "Buenos Aires", "Zona rural"
  phone TEXT,
  
  -- Métricas
  rating DECIMAL(3, 2) DEFAULT 0, -- 0-5 stars
  total_sales INTEGER DEFAULT 0,
  response_time_hours INTEGER, -- tiempo promedio de respuesta
  
  -- Documentación
  business_registration TEXT, -- número de registro
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_producer_profiles_user_id ON producer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_producer_profiles_specialty ON producer_profiles(specialty);
CREATE INDEX IF NOT EXISTS idx_producer_profiles_is_verified ON producer_profiles(is_verified);

-- ============================================================================
-- 3. TABLA: buyer_profiles (Perfil específico de Compradores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Preferencias de compra
  preferred_categories TEXT[], -- array de categorías favoritas
  dietary_preferences TEXT, -- ej: "vegano", "sin gluten"
  
  -- Historial
  total_purchases INTEGER DEFAULT 0,
  favorite_producers UUID[], -- array de productores favoritos
  
  -- Notificaciones
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_alerts BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);

-- ============================================================================
-- 4. TABLA: products (Catálogo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_organic BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_producer_id ON products(producer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- ============================================================================
-- 5. TABLA: orders (Pedidos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  consumer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_consumer_id ON orders(consumer_id);
CREATE INDEX IF NOT EXISTS idx_orders_producer_id ON orders(producer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ===== USERS TABLE =====
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view producer basic info"
  ON users FOR SELECT
  USING (role = 'producer');

-- ===== PRODUCER_PROFILES TABLE =====
CREATE POLICY "Producers can read their own profile"
  ON producer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Producers can update their own profile"
  ON producer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read verified producer profiles"
  ON producer_profiles FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Producers can create their own profile"
  ON producer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===== BUYER_PROFILES TABLE =====
CREATE POLICY "Buyers can read their own profile"
  ON buyer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Buyers can update their own profile"
  ON buyer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Buyers can create their own profile"
  ON buyer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===== PRODUCTS TABLE =====
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Producers can read their own products"
  ON products FOR SELECT
  USING (auth.uid() = producer_id);

CREATE POLICY "Producers can create products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = producer_id);

CREATE POLICY "Producers can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = producer_id)
  WITH CHECK (auth.uid() = producer_id);

CREATE POLICY "Producers can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = producer_id);

-- ===== ORDERS TABLE =====
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = consumer_id OR 
    auth.uid() = producer_id
  );

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Users can update their orders"
  ON orders FOR UPDATE
  USING (
    auth.uid() = consumer_id OR 
    auth.uid() = producer_id
  )
  WITH CHECK (
    auth.uid() = consumer_id OR 
    auth.uid() = producer_id
  );

-- ============================================================================
-- 7. FUNCIONES ÚTILES
-- ============================================================================

-- Función para obtener perfil del productor
CREATE OR REPLACE FUNCTION get_producer_profile(producer_id UUID)
RETURNS producer_profiles AS $$
  SELECT * FROM producer_profiles WHERE user_id = producer_id;
$$ LANGUAGE SQL STABLE;

-- Función para obtener perfil del comprador
CREATE OR REPLACE FUNCTION get_buyer_profile(buyer_id UUID)
RETURNS buyer_profiles AS $$
  SELECT * FROM buyer_profiles WHERE user_id = buyer_id;
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- 8. TRIGGERS (para mantener updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para producer_profiles
CREATE TRIGGER update_producer_profiles_updated_at BEFORE UPDATE ON producer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para buyer_profiles
CREATE TRIGGER update_buyer_profiles_updated_at BEFORE UPDATE ON buyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para products
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NOTAS DE MIGRACIÓN
-- ============================================================================
-- Si tienes datos existentes, ejecuta estos comandos DESPUÉS del schema:
--
-- 1. Crear registros en users (si no existen)
-- 2. Crear registros en producer_profiles para usuarios con role='producer'
-- 3. Crear registros en buyer_profiles para usuarios con role='buyer'
--
-- Ver: MIGRACION_A_PERFILES.sql
-- ============================================================================
