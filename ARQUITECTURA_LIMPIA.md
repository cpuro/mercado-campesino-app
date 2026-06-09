# 🏗️ SEPARACIÓN DE LÓGICA - Arquitectura Limpia

## 📊 Problema Identificado

### ❌ Antes (Mezcla de lógica)

```javascript
// Catalog.jsx tiene TODO mezclado:
export function Catalog() {
  // 1. Fetch de productos (lógica de datos)
  const { products, loading, fetchProducts } = useProductStore()

  // 2. Fetch de teléfonos (lógica de datos)
  useEffect(() => {
    const fetchProducerPhones = async () => {
      const { data } = await supabase.from('users')...
      // Procesar datos...
    }
  }, [products])

  // 3. Filtrado (lógica de negocio)
  const filtered = products.filter(p => {
    return matchesSearch && matchesCategory && p.quantity > 0
  })

  // 4. Ordenar (lógica de integración)
  const handleOrder = (product) => {
    openWhatsApp(producerPhone, {...})
  }

  // 5. Renderizado (UI)
  return <div>...</div>
}
```

**Problemas:**
- ❌ 60+ líneas en un componente
- ❌ Difícil de testear
- ❌ Lógica duplicada en otros componentes
- ❌ Difícil de mantener
- ❌ Mezcla de responsabilidades

---

## ✅ Solución (Separación de lógica)

### Estructura Nueva

```
src/
├── components/       ← Solo UI (presentación)
├── hooks/           ← Lógica de React (estado, efectos)
├── services/        ← Lógica de negocio
├── stores/          ← Estado global
└── utils/           ← Utilidades puras
```

---

## 🎯 Niveles de Abstracción

### Nivel 1: Componentes (UI Pura)
**Responsabilidad:** Solo renderizar  
**No hace:** Lógica de datos, cálculos complejos

```jsx
export function MyComponent({ data, onSubmit, loading }) {
  return (
    <div>
      <Button onClick={() => onSubmit(data)}>
        {loading ? 'Cargando...' : 'Enviar'}
      </Button>
    </div>
  )
}
```

### Nivel 2: Hooks (Lógica de React)
**Responsabilidad:** Estado, efectos, ciclo de vida  
**Ejemplos:** useForm, useImageUpload, useProducerPhones

```javascript
export function useImageUpload() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  const handleImageChange = (e) => {
    // Lógica de validación y preview
    imageService.validateImage(e.target.files[0])
  }

  return { imageFile, imagePreview, handleImageChange }
}
```

### Nivel 3: Services (Lógica de Negocio)
**Responsabilidad:** Operaciones de negocio, API calls  
**Ejemplos:** orderService, producerService, imageService

```javascript
export const orderService = {
  async createOrder(product, phone, quantity) {
    // Validar
    this.validateOrder(product, phone, quantity)
    // Procesar
    await supabase.from('orders').insert(...)
    // Retornar resultado
    return { success: true }
  }
}
```

### Nivel 4: Stores (Estado Global)
**Responsabilidad:** Estado de la aplicación  
**Ejemplo:** authStore, productStore

### Nivel 5: Utils (Funciones Puras)
**Responsabilidad:** Funciones sin estado  
**Ejemplos:** formatDate, calculateTotal, openWhatsApp

---

## 📦 Componentes Creados

### Hooks (en `src/hooks/`)

```javascript
✅ useImageUpload()
   - Manejo de upload de imágenes
   - Validación de tamaño
   - Generación de preview
   - Manejo de errores

✅ useProducerPhones(producerIds)
   - Obtiene teléfonos de productores
   - Caché automático
   - Manejo de loading y error

✅ useProductFilter(products, search, category)
   - Filtra productos
   - Usa useMemo para optimización
   - Devuelve array filtrado

✅ useForm(initialValues, onSubmit)
   - Manejo genérico de formularios
   - Validación
   - Manejo de loading y error

✅ useOrder()
   - Crea órdenes
   - Validaciones
   - Integración con WhatsApp
```

### Services (en `src/services/`)

```javascript
✅ imageService
   - validateImage(file)
   - uploadProductImage(file, userId)
   - getImageUrl(path)
   - deleteProductImage(path)
   - createImagePreview(file)

✅ orderService
   - validateOrder(product, phone, quantity)
   - createOrder(product, phone, quantity)
   - generateOrderSummary(product, quantity)

✅ producerService
   - getProducersPhones(ids)
   - getProducer(id)
   - getProducerProducts(id)

✅ productService
   - getAvailableProducts()
   - filterProducts(products, search, category)
   - validateProduct(data)
   - createProduct(data)
   - updateProduct(id, updates)
   - getProductStats(id)
```

---

## 🔄 Ejemplo de Refactorización

### ANTES: Catalog.jsx (70+ líneas)

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useProductStore } from '@/stores/productStore'
import { openWhatsApp } from '@/utils/whatsapp'

export default function Catalog() {
  const { products, loading, fetchProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [producerPhones, setProducerPhones] = useState({})

  // Lógica de fetch de productos
  useEffect(() => {
    fetchProducts()
  }, [])

  // Lógica de fetch de teléfonos
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
        console.error('Error:', error)
      }
    }

    fetchProducerPhones()
  }, [products])

  // Lógica de filtrado
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory && p.quantity > 0
  })

  // Lógica de ordenar
  const handleOrder = (product) => {
    const producerPhone = producerPhones[product.producer_id]
    if (!producerPhone) {
      alert('Sin contacto')
      return
    }
    openWhatsApp(producerPhone, {
      productName: product.name,
      quantity: 1,
      price: product.price,
    })
  }

  // Renderizado
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
        {/* opciones */}
      </select>
      {loading ? <Spinner /> : (
        <ProductGrid products={filtered} onOrder={handleOrder} />
      )}
    </div>
  )
}
```

### DESPUÉS: Catalog.jsx (25 líneas)

```jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import { useProducerPhones } from '@/hooks'
import { useProductFilter } from '@/hooks'
import { useOrder } from '@/hooks'
import { Container, PageHeader } from '@/components/layout'
import { SearchFilter } from '@/components/forms'
import { ProductGrid } from '@/components/product'

export default function Catalog() {
  // Datos
  const { products, loading, fetchProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Hooks que usan lógica extraída
  const { phonesMap } = useProducerPhones(
    products.map(p => p.producer_id)
  )
  const filtered = useProductFilter(products, searchTerm, categoryFilter)
  const { createOrder } = useOrder()

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleOrder = async (product) => {
    try {
      await createOrder(product, phonesMap[product.producer_id])
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <Container>
      <PageHeader title="Catálogo" />
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
- ✅ Más legible
- ✅ Fácil de testear
- ✅ Lógica reutilizable

---

## 🎯 Refactorización Recomendada

### Paso 1: Refactorizar Catalog.jsx ⭐
**Dificultad:** Media  
**Beneficio:** Alto (mucha lógica)

Usar:
- `useProducerPhones()`
- `useProductFilter()`
- `useOrder()`

### Paso 2: Refactorizar CreateProduct.jsx
**Dificultad:** Baja  
**Beneficio:** Alto

Usar:
- `useImageUpload()`
- `useForm()`
- `imageService`
- `productService`

### Paso 3: Refactorizar LoginForm.jsx
**Dificultad:** Baja  
**Beneficio:** Medio

Usar:
- `useForm()`

### Paso 4: Refactorizar otras páginas
**Dificultad:** Baja a Media  
**Beneficio:** Mejora escalabilidad

---

## 📋 Checklist de Separación

### ✅ Ya Hecho
- [x] Crear carpeta `hooks/`
- [x] Crear carpeta `services/` (mejorada)
- [x] Implementar `useImageUpload`
- [x] Implementar `useProducerPhones`
- [x] Implementar `useProductFilter`
- [x] Implementar `useForm`
- [x] Implementar `useOrder`
- [x] Implementar `imageService`
- [x] Implementar `orderService`
- [x] Implementar `producerService`
- [x] Implementar `productService` (mejorado)

### ⏳ Por Hacer
- [ ] Refactorizar Catalog.jsx
- [ ] Refactorizar CreateProduct.jsx
- [ ] Refactorizar páginas de autenticación
- [ ] Refactorizar dashboards
- [ ] Agregar tests unitarios
- [ ] Documentar arquitectura en equipo

---

## 🚀 Cómo Usar

### En un Componente

```jsx
import { useImageUpload, useForm, useOrder } from '@/hooks'
import { imageService, orderService } from '@/services'

export function MyComponent() {
  const { imageFile, handleImageChange } = useImageUpload()
  const { formData, handleSubmit } = useForm(
    { name: '', email: '' },
    async (data) => {
      // onSubmit
    }
  )
  const { createOrder } = useOrder()

  return (
    <div>
      {/* Tu UI */}
    </div>
  )
}
```

---

## 📊 Beneficios de Esta Arquitectura

✅ **Componentes más limpios** - Solo UI  
✅ **Lógica reutilizable** - Hooks y services  
✅ **Fácil de testear** - Separación de responsabilidades  
✅ **Escalable** - Agregar features sin complejidad  
✅ **Mantenible** - Cambios centralizados  
✅ **Profesional** - Sigue mejores prácticas  

---

## 📖 Nivel de Abstracción Visual

```
┌─────────────────────────────────────┐
│         COMPONENTES (UI)            │  ← Solo renderizar
│  <Button>, <Card>, <ProductGrid>    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│           HOOKS (Lógica React)      │  ← Estado + Efectos
│  useForm, useImageUpload, etc.      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│         SERVICES (Negocio)          │  ← Operaciones
│  orderService, imageService, etc.   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│         STORES (Estado Global)      │  ← Zustand/Pinia
│  authStore, productStore, etc.      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│         UTILS (Funciones Puras)     │  ← Sin estado
│  formatDate, calculateTotal, etc.   │
└─────────────────────────────────────┘
```

---

## 🎓 Próximos Pasos

1. **Refactoriza Catalog.jsx** usando hooks
2. **Refactoriza CreateProduct.jsx** usando hooks
3. **Refactoriza LoginForm.jsx** usando useForm
4. **Documenta** tu arquitectura
5. **Agrega tests** para services y hooks

---

**La separación de lógica es lo más importante para código mantenible.** ✨
