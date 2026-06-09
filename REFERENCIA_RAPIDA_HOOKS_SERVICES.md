# 📚 REFERENCIA RÁPIDA - Hooks y Services

## 🪝 HOOKS (en `src/hooks/`)

### 1️⃣ `useImageUpload()`

**Responsabilidad:** Manejo de upload de imágenes con validación

**Retorna:**
```javascript
{
  imageFile,          // File | null
  imagePreview,       // string (data URL) | null
  imageError,         // string | null
  handleImageChange,  // (e) => void
  resetImage,         // () => void
}
```

**Validaciones:**
- Max 300 KB
- Solo type: `image/*`

**Ejemplo:**
```jsx
import { useImageUpload } from '@/hooks'

export function CreateProduct() {
  const { imageFile, imagePreview, imageError, handleImageChange } = useImageUpload()

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imageError && <p className="text-red-600">{imageError}</p>}
      {imagePreview && <img src={imagePreview} alt="preview" />}
    </div>
  )
}
```

**Casos de uso:**
- Componentes de upload de imágenes
- ProductForm.jsx
- CreateProduct.jsx
- Perfiles de usuario

---

### 2️⃣ `useProducerPhones(producerIds[])`

**Responsabilidad:** Obtener teléfonos de productores desde Supabase

**Parámetros:**
```javascript
producerIds  // Array<string> - IDs de productores
```

**Retorna:**
```javascript
{
  phonesMap,  // { [producerId]: phone }
  loading,    // boolean
  error,      // Error | null
}
```

**Dependencias:**
- Supabase
- Caching automático

**Ejemplo:**
```jsx
import { useProducerPhones } from '@/hooks'

export function Catalog() {
  const products = [...] // de store
  const producerIds = products.map(p => p.producer_id)

  const { phonesMap, loading, error } = useProducerPhones(producerIds)

  if (loading) return <Spinner />
  if (error) return <Alert type="error">Error cargando contactos</Alert>

  return (
    <>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          producerPhone={phonesMap[product.producer_id]}
        />
      ))}
    </>
  )
}
```

**Casos de uso:**
- Catalog.jsx (obtener teléfonos para WhatsApp)
- Mostrar contactos de productores
- Validar disponibilidad de contacto

---

### 3️⃣ `useProductFilter(products, searchTerm, categoryFilter)`

**Responsabilidad:** Filtrar productos con memoización

**Parámetros:**
```javascript
products        // Array<Object> - Productos a filtrar
searchTerm      // string - Búsqueda por nombre/descripción
categoryFilter  // string - Categoría (vacío = todas)
```

**Retorna:**
```javascript
products[]  // Array<Object> - Productos filtrados
```

**Optimización:**
- Usa `useMemo` para evitar recálculos
- Solo recalcula si cambian dependencias

**Ejemplo:**
```jsx
import { useProductFilter } from '@/hooks'

export function Catalog() {
  const products = useProductStore(s => s.products)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filtered = useProductFilter(products, search, category)

  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <CategorySelect value={category} onChange={setCategory} />
      <ProductGrid products={filtered} />
    </div>
  )
}
```

**Criterios de filtrado:**
- `searchTerm`: busca en nombre y descripción (case-insensitive)
- `categoryFilter`: filtra por categoría exacta
- Siempre filtra `quantity > 0`

**Casos de uso:**
- Catalog.jsx (filtrado en tiempo real)
- ProducerDashboard.jsx (listar productos)
- Search page

---

### 4️⃣ `useForm(initialValues, onSubmit)`

**Responsabilidad:** Manejo genérico de formularios

**Parámetros:**
```javascript
initialValues  // { [field]: value } - Valores iniciales
onSubmit       // (formData) => Promise<void> - Handler
```

**Retorna:**
```javascript
{
  formData,      // { [field]: value } - Datos actuales
  setFormData,   // (data) => void - Actualizar datos
  handleChange,  // (e) => void - Handler para inputs
  handleSubmit,  // (e) => Promise<void> - Handler para form
  loading,       // boolean - Enviando?
  error,         // string | null - Mensaje de error
  setError,      // (msg) => void - Establecer error
  reset,         // () => void - Reiniciar formulario
}
```

**Ejemplo:**
```jsx
import { useForm } from '@/hooks'

export function LoginForm() {
  const { formData, handleChange, handleSubmit, loading, error } = useForm(
    { email: '', password: '' },
    async (data) => {
      const result = await authService.login(data)
      if (!result.success) throw new Error(result.error)
      navigate('/home')
    }
  )

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Ingresar'}
      </button>
    </form>
  )
}
```

**Casos de uso:**
- LoginForm.jsx
- RegisterForm.jsx
- Cualquier formulario
- Crear/editar productos

---

### 5️⃣ `useOrder()`

**Responsabilidad:** Crear órdenes con validación

**Retorna:**
```javascript
{
  createOrder,  // async (product, phone, quantity=1) => void
  loading,      // boolean
  error,        // string | null
}
```

**Validaciones:**
- Producto válido
- Teléfono disponible
- Cantidad disponible

**Ejemplo:**
```jsx
import { useOrder } from '@/hooks'

export function ProductCard({ product, producerPhone }) {
  const { createOrder, loading, error } = useOrder()

  const handleOrder = async () => {
    try {
      await createOrder(product, producerPhone, 1)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleOrder}
        disabled={loading || !producerPhone}
      >
        {loading ? 'Procesando...' : 'Ordenar por WhatsApp'}
      </button>
    </div>
  )
}
```

**Casos de uso:**
- Crear orden en Catalog.jsx
- ProductCard.jsx
- Cualquier lugar donde se ordene

---

## 🔧 SERVICES (en `src/services/`)

### 1️⃣ `imageService`

**Responsabilidad:** Validación y gestión de imágenes

**Métodos:**

#### `validateImage(file)`
```javascript
imageService.validateImage(file)
// Retorna: { isValid: boolean, error?: string }

// Validaciones:
// - Max 300 KB
// - type === 'image/*'
```

#### `uploadProductImage(file, userId)`
```javascript
await imageService.uploadProductImage(file, userId)
// Retorna: string (filePath)
// Lanza: Error si no pasa validación

// Ejemplo:
const filePath = await imageService.uploadProductImage(
  imageFile,
  currentUser.id
)
```

#### `getImageUrl(imagePath)`
```javascript
imageService.getImageUrl(filePath)
// Retorna: string (URL pública) | null

// Ejemplo:
const imageUrl = imageService.getImageUrl(product.image_path)
// https://bucket-url/product-images/...
```

#### `deleteProductImage(imagePath)`
```javascript
await imageService.deleteProductImage(imagePath)
// Retorna: Promise<void>
// No lanza error si no existe
```

#### `createImagePreview(file)`
```javascript
const dataUrl = await imageService.createImagePreview(file)
// Retorna: Promise<string> (data URL)

// Ejemplo:
const preview = await imageService.createImagePreview(imageFile)
setImagePreview(preview)
```

**Ejemplo completo:**
```jsx
import { imageService } from '@/services'

async function handleProductImage(imageFile, userId) {
  // 1. Validar
  const { isValid, error } = imageService.validateImage(imageFile)
  if (!isValid) throw new Error(error)

  // 2. Preview
  const preview = await imageService.createImagePreview(imageFile)

  // 3. Upload
  const filePath = await imageService.uploadProductImage(imageFile, userId)

  // 4. URL
  const url = imageService.getImageUrl(filePath)

  return { filePath, url }
}
```

---

### 2️⃣ `orderService`

**Responsabilidad:** Crear y validar órdenes

**Métodos:**

#### `validateOrder(product, phone, quantity=1)`
```javascript
orderService.validateOrder(product, producerPhone, quantity)
// Retorna: { isValid: boolean, error?: string }

// Valida:
// - Producto existe
// - Teléfono disponible
// - Cantidad > 0
// - Cantidad disponible en stock
```

#### `createOrder(product, phone, quantity=1)`
```javascript
await orderService.createOrder(product, producerPhone, 1)
// Retorna: {
//   success: boolean
//   message: string
//   data: {
//     productId, producerId, quantity, totalPrice, timestamp
//   }
// }
// Lanza: Error si validación falla

// Abre WhatsApp automáticamente
```

#### `generateOrderSummary(product, quantity=1)`
```javascript
const summary = orderService.generateOrderSummary(product, 2)
// Retorna: {
//   productName: string
//   quantity: number
//   unitPrice: number
//   totalPrice: number
//   category: string
//   description: string
//   timestamp: string
// }
```

**Ejemplo:**
```jsx
import { orderService } from '@/services'

async function handleOrder(product, producerPhone) {
  try {
    // Validar primero
    const validation = orderService.validateOrder(
      product,
      producerPhone,
      1
    )

    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    // Crear orden (abre WhatsApp)
    const result = await orderService.createOrder(
      product,
      producerPhone,
      1
    )

    console.log('Orden enviada:', result.data)
  } catch (error) {
    alert(error.message)
  }
}
```

---

### 3️⃣ `producerService`

**Responsabilidad:** Obtener información de productores

**Métodos:**

#### `getProducersPhones(producerIds[])`
```javascript
await producerService.getProducersPhones(['id1', 'id2'])
// Retorna: { [producerId]: phone }

// Ejemplo:
const phonesMap = await producerService.getProducersPhones(
  ['user-123', 'user-456']
)
// { 'user-123': '+5712345678', 'user-456': '+5787654321' }
```

#### `getProducer(producerId)`
```javascript
const producer = await producerService.getProducer('user-123')
// Retorna: {
//   id, email, phone, full_name, role
// }
```

#### `getProducerProducts(producerId)`
```javascript
const products = await producerService.getProducerProducts('user-123')
// Retorna: Array<{id, name, price, quantity, ...}>
// Solo con quantity > 0
```

**Ejemplo:**
```jsx
import { producerService } from '@/services'

async function loadProducerInfo(producerId) {
  const producer = await producerService.getProducer(producerId)
  const products = await producerService.getProducerProducts(producerId)

  return { producer, products }
}
```

---

### 4️⃣ `productService`

**Responsabilidad:** Operaciones con productos

**Métodos:**

#### `getAvailableProducts()`
```javascript
const products = await productService.getAvailableProducts()
// Retorna: Array<{id, name, price, quantity, ...}>
// Solo quantity > 0
```

#### `filterProducts(products, search, category, producerId)`
```javascript
const filtered = productService.filterProducts(
  products,
  'tomate',
  'vegetales',
  'user-123'  // opcional
)
// Filtro local, sin API
```

#### `validateProduct(productData)`
```javascript
const validation = productService.validateProduct({
  name: 'Tomate',
  price: 5.99,
  quantity: 100
})
// Retorna: {
//   isValid: boolean
//   errors: { field: message, ... }
// }
```

#### `createProduct(productData)`
```javascript
const product = await productService.createProduct({
  name: 'Tomate fresco',
  description: 'Tomates rojos frescos',
  price: 5.99,
  quantity: 100,
  category: 'vegetales',
  image_path: 'products/...',
  producer_id: 'user-123'
})
// Retorna: Producto creado
```

#### `updateProduct(productId, updates)`
```javascript
const updated = await productService.updateProduct(
  'prod-123',
  { quantity: 50, price: 6.99 }
)
// Retorna: Producto actualizado
```

#### `getProductStats(productId)`
```javascript
const stats = await productService.getProductStats('prod-123')
// Retorna: {
//   productId, availableQuantity, price, createdAt, daysListed
// }
```

**Ejemplo completo:**
```jsx
import { productService } from '@/services'

async function createNewProduct(formData) {
  // Validar
  const validation = productService.validateProduct(formData)
  if (!validation.isValid) {
    console.error(validation.errors)
    return
  }

  // Crear
  const product = await productService.createProduct({
    ...formData,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    producer_id: currentUser.id
  })

  // Stats
  const stats = await productService.getProductStats(product.id)
  console.log('Producto creado hace', stats.daysListed, 'días')
}
```

---

## 🎯 Guía de Selección: Hooks vs Services

### Usa HOOKS cuando:
- ✅ Necesitas estado en el componente
- ✅ Necesitas manejar efectos secundarios
- ✅ Necesitas lógica reutilizable entre componentes
- ✅ Lógica está acoplada al ciclo de vida del componente

**Ejemplos:**
- `useImageUpload()` - maneja estado del archivo
- `useForm()` - maneja estado del formulario
- `useProducerPhones()` - fetch con estado

### Usa SERVICES cuando:
- ✅ Lógica pura de negocio
- ✅ API calls
- ✅ Validaciones
- ✅ Transformaciones de datos
- ✅ Lógica que NO necesita estado

**Ejemplos:**
- `imageService.validateImage()` - pura validación
- `productService.filterProducts()` - lógica pura
- `orderService.createOrder()` - operación de negocio

---

## 📋 Importaciones Rápidas

```jsx
// Hooks
import { useImageUpload, useProducerPhones, useProductFilter, useForm, useOrder } from '@/hooks'

// Services
import { imageService, orderService, producerService, productService } from '@/services'

// Stores
import { useAuthStore, useProductStore } from '@/stores'

// Components
import { Button, Input, Card } from '@/components'
```

---

## ✅ Checklist: Antes de usar Hooks/Services

- [ ] ¿Instalaste el hook/service?
- [ ] ¿Importaste correctamente?
- [ ] ¿Comprendiste qué retorna?
- [ ] ¿Manejaste los errores?
- [ ] ¿Probaste en el navegador?
- [ ] ¿Sin errores en consola?

---

**Documentación completa:** Ver `ARQUITECTURA_LIMPIA.md` y `REFACTORIZACION_PASO_A_PASO.md`
