# 🔄 REFACTORIZACIÓN PASO A PASO - Separar Lógica

## Proyecto: Catalog.jsx (Mayor problema)

### ANTES ❌ (70+ líneas)

```jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import { getProductImageUrl } from '@/utils/storage'
import { openWhatsApp } from '@/utils/whatsapp'
import { supabase } from '@/lib/supabase'

export default function Catalog() {
  const { products, loading, fetchProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [producerPhones, setProducerPhones] = useState({})

  // ❌ LÓGICA 1: Fetch inicial de productos
  useEffect(() => {
    fetchProducts()
  }, [])

  // ❌ LÓGICA 2: Fetch de teléfonos (MEZCLA DE RESPONSABILIDADES)
  useEffect(() => {
    const fetchProducerPhones = async () => {
      if (products.length === 0) return

      const producerIds = [...new Set(products.map(p => p.producer_id))]
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, phone')
          .in('id', producerIds)
        
        if (error) throw error
        
        const phonesMap = {}
        data?.forEach(user => {
          phonesMap[user.id] = user.phone
        })
        setProducerPhones(phonesMap)
      } catch (error) {
        console.error('Error fetching producer phones:', error)
      }
    }

    fetchProducerPhones()
  }, [products])

  // ❌ LÓGICA 3: Filtrado (MEZCLA DE RESPONSABILIDADES)
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory && p.quantity > 0
  })

  // ❌ LÓGICA 4: Ordenar (MEZCLA DE RESPONSABILIDADES)
  const handleOrder = (product) => {
    const producerPhone = producerPhones[product.producer_id]
    
    if (!producerPhone) {
      alert('Lo sentimos, el productor no ha registrado su número de WhatsApp')
      return
    }

    openWhatsApp(producerPhone, {
      productName: product.name,
      quantity: 1,
      price: product.price,
      totalPrice: product.price
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Catálogo de productos</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-base md:w-48"
          >
            <option value="">Todas las categorías</option>
            <option value="vegetales">Vegetales</option>
            <option value="frutas">Frutas</option>
            <option value="lacteos">Lácteos</option>
            <option value="granos">Granos</option>
            <option value="otros">Otros</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="card">
              {/* Card content */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### DESPUÉS ✅ (25 líneas)

```jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import { useProducerPhones, useProductFilter, useOrder } from '@/hooks'
import { Container, PageHeader } from '@/components/layout'
import { SearchFilter } from '@/components/forms'
import { ProductGrid } from '@/components/product'

export default function Catalog() {
  // Estado de la búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Datos
  const { products, loading, fetchProducts } = useProductStore()

  // LÓGICA EXTRAÍDA EN HOOKS
  const { phonesMap } = useProducerPhones(
    products.map(p => p.producer_id)
  )
  const filtered = useProductFilter(products, searchTerm, categoryFilter)
  const { createOrder } = useOrder()

  // Solo el fetch inicial
  useEffect(() => {
    fetchProducts()
  }, [])

  // Manejador de orden simplificado
  const handleOrder = async (product) => {
    try {
      await createOrder(product, phonesMap[product.producer_id])
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <Container>
      <PageHeader title="🛍️ Catálogo" description="Productos frescos" />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      <ProductGrid
        products={filtered}
        loading={loading}
        onOrder={handleOrder}
        producerPhones={phonesMap}
      />
    </Container>
  )
}
```

**Resultado:**
- ✅ 65% menos código
- ✅ Mucho más legible
- ✅ Fácil de testear
- ✅ Reutilizable

---

## Refactorización: CreateProduct.jsx

### ANTES ❌ (80+ líneas)

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { supabase } from '@/lib/supabase'

const MAX_IMAGE_SIZE = 300 * 1024

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addProduct, loading } = useProductStore()

  // ❌ LÓGICA 1: Manejo de imagen
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')

  // ❌ LÓGICA 2: Validación de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('La imagen no debe superar los 300 KB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    setImageFile(file)
    setImageError('')
  }

  // ❌ LÓGICA 3: Upload de imagen
  const uploadImage = async () => {
    if (!imageFile) return null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, {
        upsert: false,
        contentType: imageFile.type,
      })

    if (error) throw error

    return filePath
  }

  // ❌ LÓGICA 4: Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  // ❌ LÓGICA 5: Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.quantity) {
      setError('Completa los campos obligatorios')
      return
    }

    try {
      let imagePath = null

      if (imageFile) {
        imagePath = await uploadImage()
      }

      const result = await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image_path: imagePath,
        producer_id: user.id,
        created_at: new Date().toISOString(),
      })

      if (result.success) {
        navigate('/producer')
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error(err)
      setError('Error al subir la imagen o guardar el producto')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Crear Producto</h1>
      {/* formulario */}
    </div>
  )
}
```

### DESPUÉS ✅ (35 líneas)

```jsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { useImageUpload, useForm } from '@/hooks'
import { imageService, productService } from '@/services'
import { Container, PageHeader } from '@/components/layout'
import { ProductForm } from '@/components/forms'

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addProduct } = useProductStore()

  // LÓGICA EXTRAÍDA EN HOOKS
  const { imageFile, handleImageChange } = useImageUpload()
  const { formData, handleChange, handleSubmit, error, loading } = useForm(
    { name: '', description: '', price: '', quantity: '', category: '' },
    async (data) => {
      // Validar datos
      const validation = productService.validateProduct(data)
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0])
      }

      // Upload imagen si existe
      let imagePath = null
      if (imageFile) {
        imagePath = await imageService.uploadProductImage(imageFile, user.id)
      }

      // Crear producto
      const result = await addProduct({
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        image_path: imagePath,
        producer_id: user.id,
        created_at: new Date().toISOString(),
      })

      if (result.success) {
        navigate('/producer')
      } else {
        throw new Error(result.error)
      }
    }
  )

  return (
    <Container>
      <PageHeader title="📦 Crear Producto" />
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onImageChange={handleImageChange}
      />
    </Container>
  )
}
```

**Resultado:**
- ✅ 56% menos código
- ✅ Más legible
- ✅ Más mantenible
- ✅ Fácil de testear

---

## Comparación de Complejidad

### Antes (Spaghetti Code)
```
Componente
├── Estado 1 (formData)
├── Estado 2 (imageFile)
├── Estado 3 (imageError)
├── Estado 4 (error)
├── Función 1 (handleImageChange)
├── Función 2 (uploadImage)
├── Función 3 (handleChange)
├── Función 4 (handleSubmit)
└── JSX (complejo)
```

### Después (Separación Limpia)
```
Componente
├── Hook 1: useImageUpload
│   ├── Estado (imageFile, imagePreview, etc.)
│   └── Funciones (handleImageChange, etc.)
├── Hook 2: useForm
│   ├── Estado (formData, loading, error)
│   └── Funciones (handleChange, handleSubmit, etc.)
└── JSX (simple, solo UI)
```

---

## Patrones de Refactorización

### Patrón 1: Extraer Estado en Hook

**Antes:**
```jsx
const [imageFile, setImageFile] = useState(null)
const [imagePreview, setImagePreview] = useState(null)
const [imageError, setImageError] = useState('')

const handleImageChange = (e) => {
  // ...
}
```

**Después:**
```jsx
const { imageFile, imagePreview, imageError, handleImageChange } = useImageUpload()
```

### Patrón 2: Extraer Lógica Async en Service

**Antes:**
```jsx
const uploadImage = async () => {
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, imageFile)
  // ...
}
```

**Después:**
```jsx
const imagePath = await imageService.uploadProductImage(imageFile, userId)
```

### Patrón 3: Extraer Cálculos en Hook

**Antes:**
```jsx
const filtered = products.filter(p => {
  const matchesSearch = p.name.includes(search)
  const matchesCategory = !category || p.category === category
  return matchesSearch && matchesCategory && p.quantity > 0
})
```

**Después:**
```jsx
const filtered = useProductFilter(products, search, category)
```

---

## Checklist de Refactorización

### Para cada componente:

1. **Identifica la lógica mezclada**
   - [ ] Estado complejo
   - [ ] Múltiples useEffect
   - [ ] Calls a API
   - [ ] Cálculos complejos

2. **Extrae a hooks**
   - [ ] Agrupa estado relacionado
   - [ ] Crea hooks reutilizables
   - [ ] Usa `useState`, `useEffect`, etc.

3. **Extrae a services**
   - [ ] Operaciones de API
   - [ ] Validaciones complejas
   - [ ] Transformaciones de datos

4. **Simplifica el componente**
   - [ ] Solo maneja UI
   - [ ] Usa hooks para lógica
   - [ ] Usa services para operaciones

5. **Prueba**
   - [ ] Funciona igual que antes
   - [ ] Sin errores en consola
   - [ ] Responsive en móvil

---

## Orden de Refactorización Recomendado

### Fácil (30 min cada una)
- [ ] LoginForm.jsx → Usa `useForm`
- [ ] RegisterForm.jsx → Usa `useForm`
- [ ] Home.jsx → Separar si hay lógica

### Medio (45 min cada una)
- [ ] Catalog.jsx ⭐ → Usa múltiples hooks
- [ ] CreateProduct.jsx ⭐ → Usa `useImageUpload` y `useForm`

### Difícil (60+ min cada una)
- [ ] ProducerDashboard.jsx → Lógica compleja
- [ ] AdminDashboard.jsx → Lógica compleja

---

## 📊 Impacto de la Refactorización

```
MÉTRICA                ANTES       DESPUÉS     GANANCIA
─────────────────────────────────────────────────────
Líneas en componente   80+         35          -56%
Número de hooks        0           3+          +3
Número de services     -           3+          +3
Reutilización de código NO         SÍ          ✓
Testabilidad          Baja        Alta        ↑
Mantenibilidad        Difícil     Fácil       ↑
```

---

## ✅ Beneficios Finales

✅ **Componentes enfocados** - Solo UI  
✅ **Lógica reutilizable** - Hooks y services  
✅ **Fácil de testear** - Cada parte tiene una responsabilidad  
✅ **Escalable** - Agregar features sin complejidad  
✅ **Profesional** - Arquitectura limpia  
✅ **Mantenible** - Cambios en un solo lugar  

---

**La clave es: Un componente debe hacer UNA cosa bien.** 🎯
