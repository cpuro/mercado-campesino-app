# 🚀 GUÍA RÁPIDA - USO DE SERVICIOS

## Resumen Rápido

La arquitectura del proyecto ahora separa la **lógica de negocio** en **servicios** reutilizables.

```
Antes:  Componente → Supabase (TODO mezclado)
Ahora:  Componente → Service → Store → Supabase (Limpio y profesional)
```

---

## 📦 Servicios Disponibles

| Servicio | Propósito | Ubicación |
|---|---|---|
| **authService** | Autenticación (signup, signin, logout) | `src/services/authService.js` |
| **productService** | CRUD de productos | `src/services/productService.js` |
| **uploadService** | Subir archivos a Storage | `src/services/uploadService.js` |
| **validationService** | Validar datos | `src/services/validationService.js` |

---

## 1️⃣ Usar Servicios en Componentes

### Importar Servicios

```javascript
import { 
  authService, 
  productService, 
  uploadService, 
  validationService 
} from '@/services'
```

### Validación de Producto

```javascript
// ❌ ANTES (validación inline)
if (!formData.name || formData.price <= 0) {
  setError('Datos inválidos')
}

// ✅ DESPUÉS (servicio centralizado)
const validation = validationService.validateProduct(formData)
if (!validation.valid) {
  setError(validation.error)
  return
}
```

### Upload de Imagen

```javascript
// ❌ ANTES (logic en componente)
const fileExt = imageFile.name.split('.').pop()
const fileName = `${user.id}-${Date.now()}.${fileExt}`
const { error } = await supabase.storage
  .from('product-images')
  .upload(`products/${fileName}`, imageFile)

// ✅ DESPUÉS (servicio)
const result = await uploadService.uploadImage(imageFile, user.id)
if (!result.success) {
  setError(result.error)
  return
}
const imagePath = result.path
const imageUrl = result.url
```

### Crear Producto

```javascript
// ❌ ANTES (llamada a Supabase directa)
const { data, error } = await supabase
  .from('products')
  .insert([productData])
  .select()

// ✅ DESPUÉS (a través de servicio)
const result = await productService.createProduct(productData)
if (result.success) {
  console.log('Producto creado:', result.product)
} else {
  setError(result.error)
}
```

### Obtener Productos

```javascript
// ❌ ANTES (lógica en componente)
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', category)
  .ilike('name', `%${search}%`)
  .order('created_at', { ascending: false })

// ✅ DESPUÉS (servicio con opciones)
const result = await productService.fetchProducts({
  category: 'Vegetales',
  search: 'tomate',
  limit: 20,
  offset: 0
})

if (result.success) {
  console.log('Productos:', result.products)
  console.log('Total:', result.total)
}
```

---

## 2️⃣ Usar Servicios en Stores (Zustand)

### Patrón: Service → Store → Component

```javascript
// store/productStore.js
import { create } from 'zustand'
import { productService } from '@/services'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // El store usa el servicio internamente
  fetchProducts: async (options) => {
    try {
      set({ loading: true, error: null })
      
      // ✅ Usar servicio (no Supabase directamente)
      const result = await productService.fetchProducts(options)
      
      if (result.success) {
        set({ products: result.products })
      } else {
        set({ error: result.error })
      }
    } finally {
      set({ loading: false })
    }
  },

  createProduct: async (productData) => {
    try {
      set({ loading: true, error: null })
      
      // ✅ Usar servicio
      const result = await productService.createProduct(productData)
      
      if (result.success) {
        set({ products: [result.product, ...get().products] })
        return { success: true }
      } else {
        set({ error: result.error })
        return { success: false, error: result.error }
      }
    } finally {
      set({ loading: false })
    }
  }
}))
```

### En el Componente

```javascript
// pages/CreateProduct.jsx
import { useProductStore } from '@/stores/productStore'
import { validationService, uploadService, productService } from '@/services'

export default function CreateProduct() {
  const { addProduct, loading } = useProductStore()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Validar
    const validation = validationService.validateProduct(formData)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    try {
      // 2. Upload imagen
      let imagePath = null
      if (imageFile) {
        const uploadResult = await uploadService.uploadImage(imageFile, user.id)
        if (!uploadResult.success) throw new Error(uploadResult.error)
        imagePath = uploadResult.path
      }

      // 3. Crear producto via servicio
      const result = await productService.createProduct({
        ...formData,
        image_path: imagePath,
        producer_id: user.id
      })

      if (result.success) {
        // 4. Actualizar store (caché local)
        addProduct(result.product)
        navigate('/producer-dashboard')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 3️⃣ Respuestas Estándares de Servicios

Todos los servicios retornan un objeto estandarizado:

```javascript
// Operación exitosa
{
  success: true,
  data: { /* datos aquí */ }
}

// Error
{
  success: false,
  error: "Mensaje de error descriptivo"
}
```

### Ejemplos

```javascript
// Auth Service
const result = await authService.signIn(email, password)
if (result.success) {
  const { user, role, token } = result
} else {
  const { error } = result // "Email o contraseña inválidos"
}

// Product Service
const result = await productService.createProduct(data)
if (result.success) {
  const { product } = result
} else {
  const { error } = result
}

// Upload Service
const result = await uploadService.uploadImage(file, userId)
if (result.success) {
  const { path, url } = result // path para BD, url para mostrar
} else {
  const { error } = result
}

// Validation Service
const validation = validationService.validateEmail(email)
if (!validation.valid) {
  const { error } = validation // "Email inválido"
}
```

---

## 🛠️ CASOS DE USO COMUNES

### Caso 1: Registrar Usuario

```javascript
// ❌ ANTES
const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email, password
  })
  if (!error) {
    set({ user: data.user })
  }
}

// ✅ DESPUÉS
const handleSignUp = async () => {
  const result = await authService.signUp(email, password, 'producer')
  if (result.success) {
    setUser(result.user)
    setMessage(result.message) // "Verifica tu email"
  } else {
    setError(result.error)
  }
}
```

### Caso 2: Actualizar Producto

```javascript
// ✅ CORRECTO
const handleUpdate = async (productId, updates) => {
  // Validar primero
  const validation = validationService.validateProduct(updates)
  if (!validation.valid) {
    setError(validation.error)
    return
  }

  // Usar servicio
  const result = await productService.updateProduct(productId, updates)
  if (result.success) {
    // Actualizar store
    updateProduct(result.product)
    navigate('/producer-dashboard')
  } else {
    setError(result.error)
  }
}
```

### Caso 3: Búsqueda con Filtros

```javascript
// ✅ CORRECTO
const handleSearch = async (searchTerm, category) => {
  const result = await productService.fetchProducts({
    search: searchTerm,
    category: category,
    limit: 50,
    offset: 0
  })

  if (result.success) {
    setProducts(result.products)
    setTotal(result.total)
  } else {
    setError(result.error)
  }
}
```

---

## 🧪 Testeo de Servicios

### Sin cambiar componentes, prueba servicios directamente

```javascript
// test/services/productService.test.js
import { productService } from '@/services'

describe('ProductService', () => {
  test('crea producto válido', async () => {
    const result = await productService.createProduct({
      name: 'Tomates',
      price: 100,
      quantity: 50,
      category: 'Vegetales',
      producer_id: 'user123'
    })
    
    expect(result.success).toBe(true)
    expect(result.product.name).toBe('Tomates')
  })

  test('rechaza producto sin nombre', async () => {
    const result = await productService.createProduct({
      price: 100,
      quantity: 50
    })
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('nombre')
  })
})
```

---

## 📋 Checklist de Refactorización

Usa esta lista para refactorizar componentes existentes:

- [ ] Importar servicios necesarios
- [ ] Reemplazar validaciones inline con `validationService`
- [ ] Reemplazar uploads con `uploadService`
- [ ] Reemplazar llamadas a Supabase con servicios
- [ ] Actualizar stores para usar servicios
- [ ] Manejar errores con resultado.error
- [ ] Testear el componente
- [ ] Actualizar documentación

---

## ✅ Beneficios Logrados

| Antes | Después |
|---|---|
| Lógica mezclada | Lógica centralizada |
| Difícil testear | Fácil testear |
| Hard-coded validaciones | Validaciones reutilizables |
| Código duplicado | Una fuente de verdad |
| Difícil de mantener | Fácil de mantener |
| Acoplado a Supabase | Independiente de backend |

---

## 📚 Referencias

- [authService.js](src/services/authService.js) - Métodos disponibles
- [productService.js](src/services/productService.js) - CRUD completo
- [uploadService.js](src/services/uploadService.js) - Validación y upload
- [validationService.js](src/services/validationService.js) - Reglas de validación

---

**Próximo paso:** Refactorizar componentes existentes para usar los servicios.
