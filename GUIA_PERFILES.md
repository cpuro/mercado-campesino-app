# 👤 GUÍA DE PERFILES - ARQUITECTURA EMPRESARIAL

**Fecha:** Mayo 28, 2026  
**Versión:** 2.0 - Roles con Perfiles Separados

---

## 📋 RESUMEN EJECUTIVO

La nueva arquitectura separa cada **rol en su propio perfil** con campos específicos:

```
users (id, email, role)
  ├─ producer_profiles (business_name, specialty, rating, etc)
  └─ buyer_profiles (preferences, favorite_producers, etc)
```

Esto es mucho **más escalable y profesional** que tener todo en una tabla.

---

## 🎯 ESTRUCTURA DE PERFILES

### 1. Tabla `users` (Base)

**Campos:**
```javascript
{
  id: UUID,                    // ← Referencia a auth.users
  email: string,               // ← Único
  role: 'admin'|'producer'|'buyer',
  full_name: string,
  avatar_url: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

**Propósito:**
- Autenticación base
- Información compartida por todos los roles
- Rápida de consultar

---

### 2. Tabla `producer_profiles` (Solo Productores)

**Cuándo existe:** Cuando `users.role = 'producer'`

**Campos:**
```javascript
{
  id: UUID,                      // PK propio
  user_id: UUID,                 // FK → users.id (UNIQUE)
  
  // Información del negocio
  business_name: string,         // ej: "Huerta Orgánica María"
  description: string,           // ej: "Producción agroecológica desde 2010"
  specialty: string,             // ej: "Vegetales orgánicos"
  
  // Ubicación
  area: string,                  // ej: "Zona 5, Buenos Aires"
  phone: string,                 // Teléfono de contacto
  
  // Métricas
  rating: decimal (0-5),         // Calificación promedio
  total_sales: integer,          // Cantidad de pedidos completados
  response_time_hours: integer,  // Tiempo promedio de respuesta
  
  // Documentación
  business_registration: string, // Número de registro
  is_verified: boolean,          // ¿Perfil verificado?
  
  created_at: timestamp,
  updated_at: timestamp
}
```

**Casos de Uso:**
```javascript
// Obtener info del productor
const producer = await supabase
  .from('producer_profiles')
  .select('*')
  .eq('user_id', producerId)
  .single()

// Actualizar specialty
await supabase
  .from('producer_profiles')
  .update({ specialty: 'Lácteos artesanales' })
  .eq('user_id', userId)
```

---

### 3. Tabla `buyer_profiles` (Solo Compradores)

**Cuándo existe:** Cuando `users.role = 'buyer'`

**Campos:**
```javascript
{
  id: UUID,                          // PK propio
  user_id: UUID,                     // FK → users.id (UNIQUE)
  
  // Preferencias de compra
  preferred_categories: string[],    // ej: ['Vegetales', 'Frutas']
  dietary_preferences: string,       // ej: "vegano, sin gluten"
  
  // Historial
  total_purchases: integer,          // Cantidad de compras
  favorite_producers: UUID[],        // IDs de productores favoritos
  
  // Notificaciones
  notifications_enabled: boolean,    // ¿Recibir notificaciones?
  email_alerts: boolean,            // ¿Alertas por email?
  
  created_at: timestamp,
  updated_at: timestamp
}
```

**Casos de Uso:**
```javascript
// Agregar productor favorito
const buyerProfile = await supabase
  .from('buyer_profiles')
  .select('favorite_producers')
  .eq('user_id', buyerId)
  .single()

// Actualizar favoritos
const updatedFavorites = [
  ...buyerProfile.favorite_producers,
  newProducerId
]

await supabase
  .from('buyer_profiles')
  .update({ favorite_producers: updatedFavorites })
  .eq('user_id', buyerId)
```

---

## 🔄 FLUJOS TÍPICOS

### Flujo 1: Registrar un Productor

```javascript
// 1. Usuario se registra en auth.users (Supabase Auth)
const { user, error } = await authService.signUp(
  email,
  password,
  'producer'  // ← role
)

// 2. Crear registro en tabla users
await supabase.from('users').insert({
  id: user.id,
  email: user.email,
  role: 'producer',
  full_name: fullName
})

// 3. Crear perfil de productor
await supabase.from('producer_profiles').insert({
  user_id: user.id,
  business_name: 'Mi Huerta',
  specialty: 'Vegetales orgánicos',
  area: 'Buenos Aires'
})
```

### Flujo 2: Registrar un Comprador

```javascript
// 1. Usuario se registra
const { user } = await authService.signUp(
  email,
  password,
  'buyer'  // ← role
)

// 2. Crear registro en users
await supabase.from('users').insert({
  id: user.id,
  email: user.email,
  role: 'buyer',
  full_name: fullName
})

// 3. Crear perfil de comprador
await supabase.from('buyer_profiles').insert({
  user_id: user.id,
  preferred_categories: ['Vegetales', 'Frutas'],
  notifications_enabled: true
})
```

### Flujo 3: Obtener Información Completa del Productor

```javascript
// Obtener datos del usuario + su perfil
const producerData = await supabase
  .from('users')
  .select(`
    id,
    email,
    full_name,
    avatar_url,
    producer_profiles (
      business_name,
      specialty,
      rating,
      is_verified
    )
  `)
  .eq('id', producerId)
  .eq('role', 'producer')
  .single()

// Resultado:
{
  id: 'uuid-123',
  email: 'maria@example.com',
  full_name: 'María García',
  producer_profiles: {
    business_name: 'Huerta Orgánica María',
    specialty: 'Vegetales',
    rating: 4.8,
    is_verified: true
  }
}
```

---

## 🔐 ROW LEVEL SECURITY (RLS)

### Protecciones Implementadas

#### Usuarios
```sql
-- Cada usuario solo ve su propio perfil
✅ SELECT: auth.uid() = id
✅ UPDATE: auth.uid() = id
```

#### Producer Profiles
```sql
-- Productor solo edita su propio perfil
✅ SELECT: auth.uid() = user_id (o is_verified = true)
✅ UPDATE: auth.uid() = user_id
✅ INSERT: auth.uid() = user_id
```

#### Buyer Profiles
```sql
-- Comprador solo edita su propio perfil
✅ SELECT: auth.uid() = user_id
✅ UPDATE: auth.uid() = user_id
✅ INSERT: auth.uid() = user_id
```

#### Products
```sql
-- Todos ven productos activos
✅ SELECT: is_active = true
-- Productor solo edita sus productos
✅ UPDATE/DELETE: auth.uid() = producer_id
```

---

## 📊 CASOS DE USO AVANZADOS

### Caso 1: Buscar Productores Verificados de una Especialidad

```javascript
const specialtyProducers = await supabase
  .from('producer_profiles')
  .select(`
    id,
    user_id,
    business_name,
    specialty,
    rating,
    users (
      full_name,
      email
    )
  `)
  .eq('specialty', 'Vegetales orgánicos')
  .eq('is_verified', true)
  .order('rating', { ascending: false })
```

### Caso 2: Obtener Dashboard del Productor

```javascript
// Productor ve su información + sus productos
const dashboardData = await Promise.all([
  // Información del perfil
  supabase
    .from('producer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single(),
  
  // Sus productos
  supabase
    .from('products')
    .select('*')
    .eq('producer_id', userId),
  
  // Sus órdenes recientes
  supabase
    .from('orders')
    .select('*')
    .eq('producer_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
])
```

### Caso 3: Comprador ve Productores Favoritos

```javascript
// Obtener lista de productores favoritos del comprador
const buyerProfile = await supabase
  .from('buyer_profiles')
  .select('favorite_producers')
  .eq('user_id', buyerId)
  .single()

// Obtener detalles de productores favoritos
const favoriteProducers = await supabase
  .from('producer_profiles')
  .select('*, users(full_name, email)')
  .in('user_id', buyerProfile.favorite_producers)
```

---

## 🛠️ UTILIDADES Y HELPERS

### Service Layer (Recomendado)

```javascript
// services/producerService.js
export const producerService = {
  /**
   * Crea un perfil de productor
   */
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('producer_profiles')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Obtiene perfil completo del productor
   */
  async getFullProfile(userId) {
    const { data, error } = await supabase
      .from('producer_profiles')
      .select(`
        *,
        users (id, email, full_name, avatar_url)
      `)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Actualiza specialty del productor
   */
  async updateSpecialty(userId, specialty) {
    const { error } = await supabase
      .from('producer_profiles')
      .update({ specialty })
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  }
}

// services/buyerService.js
export const buyerService = {
  /**
   * Agrega productor a favoritos
   */
  async addFavoriteProducer(buyerId, producerId) {
    const profile = await supabase
      .from('buyer_profiles')
      .select('favorite_producers')
      .eq('user_id', buyerId)
      .single()

    const updated = [
      ...(profile.data?.favorite_producers || []),
      producerId
    ]

    await supabase
      .from('buyer_profiles')
      .update({ favorite_producers: updated })
      .eq('user_id', buyerId)
  }
}
```

---

## 🔄 MIGRACIÓN DESDE ESTRUCTURA ANTERIOR

Si tienes datos en la estructura antigua (solo users.role):

```bash
# 1. Ejecutar schema nuevo
cat SUPABASE_SETUP_v2.sql | psql ...

# 2. Ejecutar migración
cat MIGRACION_A_PERFILES.sql | psql ...

# 3. Verificar
SELECT 
  'Users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'Producer Profiles', COUNT(*) FROM producer_profiles
UNION ALL
SELECT 'Buyer Profiles', COUNT(*) FROM buyer_profiles
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

```
□ Ejecutar SUPABASE_SETUP_v2.sql
□ Ejecutar MIGRACION_A_PERFILES.sql
□ Verificar que users, producer_profiles, buyer_profiles se crearon
□ Crear servicios: producerService, buyerService
□ Actualizar productService para usar la nueva estructura
□ Refactorizar componentes (ProducerDashboard, Catalog, etc)
□ Tests para nuevos servicios
□ Verificar RLS funciona correctamente
```

---

## 🎯 VENTAJAS DE ESTA ARQUITECTURA

✅ **Escalable** - Fácil agregar nuevos roles (ej: 'supplier', 'logistics')
✅ **Flexible** - Cada rol con sus propios campos
✅ **Profesional** - Estructura normalizada
✅ **Segura** - RLS claro por rol
✅ **Mantenible** - Lógica de negocio bien separada
✅ **Testeable** - Perfiles independientes

---

## 📚 REFERENCIAS

- `SUPABASE_SETUP_v2.sql` - Schema completo
- `MIGRACION_A_PERFILES.sql` - Script de migración
- `COMO_ESTA_CREADO.md` - Documentación actualizada
- `DISENO_BASE_DATOS.md` - Diagrama ER (será actualizado)

---

**Status:** ✅ Arquitectura Empresarial Implementada  
**Próximo:** Refactorizar componentes para usar nueva estructura
