# 🗄️ DISEÑO DE BASE DE DATOS - MERCADO CAMPESINO DIGITAL

## Diagrama Entidad-Relación (ER)

```
┌──────────────────────┐         ┌──────────────────────┐
│    auth.users        │         │      users           │
│  (Autenticación)     │    1:1  │   (Perfil Extendido) │
├──────────────────────┤─────────├──────────────────────┤
│ PK id (UUID)         │◄───────►│ PK id (UUID FK)      │
│ email                │         │ email                │
│ password (hash)      │         │ first_name           │
│ user_metadata        │         │ last_name            │
│ ├─ role              │         │ phone ⭐️             │
│ └─ ...               │         │ avatar_url           │
│ created_at           │         │ created_at           │
│ last_sign_in_at      │         │ updated_at           │
└──────────────────────┘         └──────────────────────┘
            ▲                                  ▲
            │                                  │
            │                    1:N          │
            │                                  │
            │    ┌────────────────────────┐    │
            └────┤      products          │────┘
                 │ (Ofertas de Productos) │
                 ├────────────────────────┤
                 │ PK id (UUID)           │
                 │ FK producer_id ────────┘
                 │ name                   │
                 │ description            │
                 │ price (DECIMAL)        │
                 │ quantity               │
                 │ category               │
                 │ image_url              │
                 │ created_at             │
                 │ updated_at             │
                 └────────────────────────┘
                            ▲
                            │
                    1:N      │
                            │
                 ┌──────────────────────────┐
                 │      orders              │
                 │ (Historial de Pedidos)   │
                 ├──────────────────────────┤
                 │ PK id (UUID)             │
                 │ FK product_id────────────┤
                 │ FK consumer_id──┐        │
                 │ FK producer_id──┤────┐   │
                 │ quantity        │    │   │
                 │ total_price     │    │   │
                 │ status          │    │   │
                 │ message         │    │   │
                 │ created_at      │    │   │
                 │ updated_at      │    │   │
                 └──────────────────────────┘
                            ▲
                            │
                       FK consumer_id
                       FK producer_id
```

---

## Tablas Detalladas

### 1️⃣ TABLA: `auth.users` (Supabase Auth)

**Propósito:** Autenticación de usuarios (creada automáticamente por Supabase)

| Columna | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador único |
| email | TEXT | Email para login |
| encrypted_password | BYTEA | Contraseña hasheada |
| email_confirmed_at | TIMESTAMP | Confirmación de email |
| user_metadata | JSONB | Datos personalizados: `{ "role": "producer" }` |
| raw_app_meta_data | JSONB | Datos de app internos |
| created_at | TIMESTAMP | Fecha de creación |
| last_sign_in_at | TIMESTAMP | Último login |

**Ejemplo:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "juan@ejemplo.com",
  "user_metadata": {
    "role": "producer"
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2️⃣ TABLA: `users` (Perfil del Usuario)

**Propósito:** Información adicional del perfil (nombre, apellido, teléfono)

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK, FK(auth.users.id) | Referencia al usuario autenticado |
| email | TEXT | NOT NULL | Email (copia para facilidad) |
| first_name | TEXT | NULLABLE | Nombre del usuario |
| last_name | TEXT | NULLABLE | Apellido del usuario |
| phone | TEXT | NULLABLE | ⭐ **Número de WhatsApp** |
| role | TEXT | NOT NULL, DEFAULT 'consumer' | 'producer', 'consumer', 'admin' |
| avatar_url | TEXT | NULLABLE | URL de foto de perfil |
| created_at | TIMESTAMP | DEFAULT now() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT now() | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_users_email ON users(email)
CREATE INDEX idx_users_role ON users(role)
CREATE INDEX idx_users_phone ON users(phone)
```

**Ejemplo:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "juan@ejemplo.com",
  "first_name": "Juan",
  "last_name": "García",
  "phone": "+573001234567",
  "role": "producer",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

**RLS Policies:**
```sql
-- Los usuarios solo pueden ver su propio perfil
CREATE POLICY "users_read_own"
  ON users FOR SELECT
  USING (auth.uid() = id)

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id)
```

---

### 3️⃣ TABLA: `products` (Productos/Ofertas)

**Propósito:** Catálogo de productos publicados por productores

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | ID único del producto |
| producer_id | UUID | FK(auth.users.id), NOT NULL | Quién publicó este producto |
| name | TEXT | NOT NULL | Nombre del producto |
| description | TEXT | NULLABLE | Descripción detallada |
| price | DECIMAL(10,2) | NOT NULL | Precio unitario (hasta $9,999,999.99) |
| quantity | INTEGER | DEFAULT 0 | Cantidad disponible |
| category | TEXT | NULLABLE | Categoría (vegetales, frutas, etc.) |
| image_url | TEXT | NULLABLE | URL de imagen del producto |
| created_at | TIMESTAMP | DEFAULT now() | Fecha de publicación |
| updated_at | TIMESTAMP | DEFAULT now() | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_products_producer_id ON products(producer_id)
CREATE INDEX idx_products_category ON products(category)
CREATE INDEX idx_products_created_at ON products(created_at)
```

**Ejemplo:**
```json
{
  "id": "789a1234-5678-90ab-cdef-1234567890ab",
  "producer_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Tomates frescos",
  "description": "Tomates cultivados en huerta orgánica",
  "price": 2.50,
  "quantity": 50,
  "category": "vegetales",
  "image_url": "https://ejemplo.com/tomates.jpg",
  "created_at": "2024-01-15T11:00:00Z"
}
```

**RLS Policies:**
```sql
-- Todos pueden ver productos publicados
CREATE POLICY "products_read_public"
  ON products FOR SELECT
  USING (true)

-- Solo el productor puede crear sus propios productos
CREATE POLICY "products_create_own"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = producer_id)

-- Solo el productor puede editar sus propios productos
CREATE POLICY "products_update_own"
  ON products FOR UPDATE
  USING (auth.uid() = producer_id)
  WITH CHECK (auth.uid() = producer_id)

-- Solo el productor puede borrar sus propios productos
CREATE POLICY "products_delete_own"
  ON products FOR DELETE
  USING (auth.uid() = producer_id)
```

---

### 4️⃣ TABLA: `orders` (Órdenes - OPCIONAL)

**Propósito:** Historial de pedidos realizados (para futuro)

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | ID único de la orden |
| product_id | UUID | FK(products.id), NOT NULL | Producto ordenado |
| consumer_id | UUID | FK(auth.users.id), NOT NULL | Quién hizo el pedido |
| producer_id | UUID | FK(auth.users.id), NOT NULL | Quién recibe el pedido |
| quantity | INTEGER | NOT NULL | Cantidad de unidades |
| total_price | DECIMAL(10,2) | NOT NULL | Precio total = quantity × product.price |
| status | TEXT | DEFAULT 'pending', CHECK | Estado: pending, confirmed, completed, cancelled |
| message | TEXT | NULLABLE | Mensaje adicional del consumidor |
| created_at | TIMESTAMP | DEFAULT now() | Cuándo se hizo el pedido |
| updated_at | TIMESTAMP | DEFAULT now() | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_orders_consumer_id ON orders(consumer_id)
CREATE INDEX idx_orders_producer_id ON orders(producer_id)
CREATE INDEX idx_orders_status ON orders(status)
```

**Ejemplo:**
```json
{
  "id": "aaa1b2c3-d4e5-6f7g-h8i9-j0k1l2m3n4o5",
  "product_id": "789a1234-5678-90ab-cdef-1234567890ab",
  "consumer_id": "999e9999-e99b-99d3-a999-999999999999",
  "producer_id": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 5,
  "total_price": 12.50,
  "status": "confirmed",
  "message": "Entregar en la tarde",
  "created_at": "2024-01-15T14:20:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

**RLS Policies:**
```sql
-- Consumidor y productor ven sus propias órdenes
CREATE POLICY "orders_read_own"
  ON orders FOR SELECT
  USING (
    auth.uid() = consumer_id OR 
    auth.uid() = producer_id
  )

-- Solo consumidores pueden crear órdenes
CREATE POLICY "orders_create_consumer"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = consumer_id)
```

---

## 🔄 Relaciones y Flujo de Datos

### Relación 1: Usuario → Productos

```
users.id = 123
    │
    ├─ products.producer_id = 123 (publicó estos productos)
    │   ├─ Tomates: $2.50
    │   ├─ Lechugas: $1.20
    │   └─ Cebollas: $0.80
```

### Relación 2: Producto → Órdenes (Futuro)

```
products.id = 789
    │
    ├─ orders.product_id = 789 (se han hecho estos pedidos)
    │   ├─ Orden 1: 5 unidades, consumidor A
    │   ├─ Orden 2: 3 unidades, consumidor B
    │   └─ Orden 3: 10 unidades, consumidor C
```

---

## 📊 Queries Comunes

### 1. Ver todos los productos de un productor
```sql
SELECT * FROM products 
WHERE producer_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY created_at DESC
```

### 2. Obtener el teléfono de un productor (para WhatsApp)
```sql
SELECT phone FROM users 
WHERE id = '123e4567-e89b-12d3-a456-426614174000'
```

### 3. Cargar catálogo (consumidor viendo productos)
```sql
SELECT 
  p.*,
  u.first_name, u.last_name, u.phone
FROM products p
JOIN users u ON p.producer_id = u.id
WHERE p.quantity > 0
ORDER BY p.created_at DESC
```

### 4. Obtener órdenes de un productor (futuro)
```sql
SELECT o.*, p.name as product_name, u.email as consumer_email
FROM orders o
JOIN products p ON o.product_id = p.id
JOIN users u ON o.consumer_id = u.id
WHERE o.producer_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY o.created_at DESC
```

---

## 🔐 Row Level Security (RLS) Summary

| Tabla | Política | Acceso |
|---|---|---|
| users | read_own | Solo lees tu perfil |
| users | update_own | Solo editas tu perfil |
| products | read_public | Todos leen todos los productos |
| products | create_own | Solo creas tus productos |
| products | update_own | Solo editas tus productos |
| products | delete_own | Solo borras tus productos |
| orders | read_own | Ves tus órdenes (como consumidor o productor) |
| orders | create_consumer | Solo consumidores crean órdenes |

---

## 📈 Ejemplo de Data Completo

### Scenario: Productor Juan vende tomates, Consumidor María compra

**Tabla auth.users:**
```
id: uuid-juan
email: juan@ejemplo.com
role: producer

id: uuid-maria
email: maria@ejemplo.com
role: consumer
```

**Tabla users:**
```
id: uuid-juan
first_name: Juan
last_name: García
phone: +573001234567  ← ⭐ Aquí está el WhatsApp
role: producer

id: uuid-maria
first_name: María
last_name: López
phone: +573019876543
role: consumer
```

**Tabla products:**
```
id: uuid-tomates
producer_id: uuid-juan
name: Tomates frescos
price: 2.50
quantity: 50
```

**Tabla orders (futuro):**
```
id: uuid-order-1
product_id: uuid-tomates
consumer_id: uuid-maria
producer_id: uuid-juan
quantity: 5
total_price: 12.50
```

**Flujo en la aplicación:**
```
1. María ve en catálogo: Tomates $2.50 (de Juan)
2. La app obtiene: users.phone WHERE id = uuid-juan
3. Resultado: +573001234567
4. María hace clic "Hacer pedido"
5. Se abre: wa.me/573001234567?text=Hola quiero pedir 5 tomates
6. ¡Juan recibe el mensaje en WhatsApp!
```

---

## ⚙️ Triggers y Funciones

### Trigger 1: Crear usuario automáticamente en signup
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user()
```

**Función:**
```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'consumer')
  )
  RETURN NEW
END
$$ LANGUAGE plpgsql SECURITY DEFINER
```

### Trigger 2: Actualizar timestamp automáticamente
```sql
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column()
```

**Función:**
```sql
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP
  RETURN NEW
END
$$ LANGUAGE plpgsql
```

---

## 💾 Backup y Migración

### Exportar datos (CSV):
```bash
# En Supabase Dashboard → Table Editor
# Clic derecho en tabla → Export as CSV
```

### Respaldar schema:
```bash
# En Supabase Dashboard → SQL Editor
# Clic en "Refresh" en el panel lateral
# Todos los queries están en SUPABASE_SETUP.sql
```

---

## 📊 Estadísticas

| Métrica | Valor |
|---|---|
| Total de tablas | 3 (+ 1 opcional) |
| Total de índices | 9 |
| Total de triggers | 4 |
| Total de RLS policies | 11 |
| Tamaño estimado (1000 productos) | ~1-2 MB |

---

## ✅ Checklist de Setup

- [ ] Crear tabla `users`
- [ ] Crear tabla `products`
- [ ] Crear tabla `orders` (opcional)
- [ ] Activar RLS en todas las tablas
- [ ] Crear 11 RLS policies
- [ ] Crear 9 índices
- [ ] Crear 4 triggers
- [ ] Probar querys de ejemplo
- [ ] Verificar que el teléfono se guarda
- [ ] Probar flujo completo

✅ **Tu base de datos está lista!**
