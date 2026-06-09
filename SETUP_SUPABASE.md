# Setup de Supabase para Mercado Campesino Digital

## 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Crear cuenta o iniciar sesión
4. Crear nuevo proyecto (ej: "mercado-campesino")
5. Esperar a que se cree la base de datos

## 2. Obtener credenciales

En el dashboard de Supabase:
1. Settings → API
2. Copiar:
   - `Project URL` → VITE_SUPABASE_URL
   - `anon public` (en "Project API keys") → VITE_SUPABASE_ANON_KEY

Guardar en `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx
```

## 3. Crear tablas

En Supabase: SQL Editor → New Query

### Tabla: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL CHECK (role IN ('producer', 'consumer', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Tabla: products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  category TEXT CHECK (category IN ('vegetales', 'frutas', 'lacteos', 'granos', 'otros', '')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX idx_products_producer_id ON products(producer_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Trigger
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Productos públicos" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Productores editan sus productos" ON products FOR UPDATE USING (auth.uid() = producer_id);
CREATE POLICY "Productores crean productos" ON products FOR INSERT WITH CHECK (auth.uid() = producer_id);
CREATE POLICY "Productores eliminan sus productos" ON products FOR DELETE USING (auth.uid() = producer_id);
```

### Tabla: orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  consumer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_orders_consumer_id ON orders(consumer_id);
CREATE INDEX idx_orders_producer_id ON orders(producer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Trigger
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Consumidores ven sus pedidos" ON orders FOR SELECT 
  USING (auth.uid() = consumer_id);

CREATE POLICY "Productores ven sus pedidos" ON orders FOR SELECT 
  USING (auth.uid() = producer_id);

CREATE POLICY "Consumidores crean pedidos" ON orders FOR INSERT 
  WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Consumidores actualizan sus pedidos" ON orders FOR UPDATE 
  USING (auth.uid() = consumer_id);
```

## 4. Configurar autenticación

1. En Supabase: Authentication → Providers
2. Email: Activado por defecto ✅
3. (Opcional) Google: 
   - Ir a Google Cloud Console
   - Crear credenciales OAuth
   - Copiar Client ID y Secret
   - Pegar en Supabase

## 5. Configurar Storage (para imágenes)

1. En Supabase: Storage
2. Click "New bucket" → "products"
3. Desactivar "Public bucket" (por ahora)
4. Click "Create"

### Políticas para Storage (SQL Editor):

```sql
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Producers can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated'
);
```

## 6. Testing

Desde la app:
1. Registrate como productor
2. Publica un producto
3. Registrate como consumidor (otro email)
4. Explora el catálogo
5. Haz un pedido por WhatsApp

## 7. Monitoreo

En Supabase Dashboard:
- **Database** → Ver datos en tiempo real
- **Auth** → Ver usuarios registrados
- **Logs** → Debugging y errores
- **Storage** → Imágenes subidas

## Tips de seguridad

✅ Habilitar RLS en todas las tablas  
✅ Usar políticas específicas  
✅ No usar contraseñas débiles  
✅ Configurar CORS correctamente  
✅ Usar variables de entorno  
✅ Validar datos en el servidor (Supabase Edge Functions)  

## URLs útiles

- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- API Reference: https://supabase.com/docs/reference/javascript
