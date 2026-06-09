# 🎨 Guía de Modularización UI - Refactorización

## Estructura Creada

```
components/
├── ui/                          # Componentes base reutilizables
│   ├── Button.jsx              # Botones con variantes
│   ├── Card.jsx                # Cards contenedor
│   ├── Input.jsx               # Inputs con validación
│   ├── Select.jsx              # Selects
│   ├── Alert.jsx               # Alertas (success, error, warning, info)
│   ├── Badge.jsx               # Badges
│   ├── Spinner.jsx             # Spinner de carga
│   └── index.js
│
├── forms/                       # Componentes de formularios
│   ├── LoginForm.jsx           # Formulario de login refactorizado
│   ├── RegisterForm.jsx        # Formulario de registro refactorizado
│   ├── ProductForm.jsx         # Formulario de productos refactorizado
│   ├── SearchFilter.jsx        # Buscador y filtros
│   └── index.js
│
├── product/                     # Componentes específicos de productos
│   ├── ProductCard.jsx         # Card individual de producto
│   ├── ProductGrid.jsx         # Grid de productos
│   ├── ProductImage.jsx        # Componente de imagen de producto
│   ├── OrderButton.jsx         # Botón de ordenar
│   └── index.js
│
├── layout/                      # Componentes de layout
│   ├── MainLayout.jsx          # Layout principal con Navbar y Footer
│   ├── Container.jsx           # Container max-width
│   ├── PageHeader.jsx          # Header de página reutilizable
│   ├── FormCard.jsx            # Card especializada para formularios
│   └── index.js
│
├── Navbar.jsx                   # (Existente)
└── index.js                     # Exporta todos los componentes
```

## Ejemplos de Refactorización

### 1. Refactorizar Login.jsx

**Antes:**
```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn(formData.email, formData.password)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">
        {/* ... JSX ... */}
      </div>
    </div>
  )
}
```

**Después:**
```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FormCard } from '@/components/layout'
import { LoginForm } from '@/components/forms'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading, error } = useAuthStore()

  const handleSubmit = async (credentials) => {
    const result = await signIn(credentials.email, credentials.password)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Inicia sesión en tu cuenta">
        <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  )
}
```

### 2. Refactorizar Register.jsx

**Después:**
```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FormCard } from '@/components/layout'
import { RegisterForm } from '@/components/forms'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, loading, error } = useAuthStore()

  const handleSubmit = async (credentials) => {
    const result = await signUp(credentials.email, credentials.password, credentials.role)
    if (result.success) {
      if (credentials.role === 'producer') {
        navigate('/producer')
      } else if (credentials.role === 'consumer') {
        navigate('/catalog')
      } else {
        navigate('/admin')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Crea una nueva cuenta">
        <RegisterForm onSubmit={handleSubmit} error={error} loading={loading} />
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  )
}
```

### 3. Refactorizar CreateProduct.jsx

**Después:**
```jsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { ProductForm } from '@/components/forms'
import { Container, PageHeader } from '@/components/layout'
import { supabase } from '@/lib/supabase'

const MAX_IMAGE_SIZE = 300 * 1024

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addProduct, loading } = useProductStore()
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

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

  const handleSubmit = async (productData) => {
    try {
      let imagePath = null
      if (imageFile) {
        imagePath = await uploadImage()
      }

      const result = await addProduct({
        ...productData,
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
      setError('Error al subir la imagen o guardar el producto')
    }
  }

  return (
    <Container>
      <PageHeader
        title="📦 Crear Producto"
        description="Publica tu nuevo producto"
      />
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onImageChange={setImageFile}
      />
    </Container>
  )
}
```

### 4. Refactorizar Catalog.jsx

**Después:**
```jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import { ProductGrid } from '@/components/product'
import { SearchFilter } from '@/components/forms'
import { Container, PageHeader } from '@/components/layout'
import { openWhatsApp } from '@/utils/whatsapp'
import { supabase } from '@/lib/supabase'

export default function Catalog() {
  const { products, loading, fetchProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [producerPhones, setProducerPhones] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  // Cargar números de teléfono
  useEffect(() => {
    const fetchProducerPhones = async () => {
      if (products.length === 0) return
      const producerIds = [...new Set(products.map(p => p.producer_id))]
      
      const { data, error } = await supabase
        .from('users')
        .select('id, phone')
        .in('id', producerIds)
      
      if (!error && data) {
        const phonesMap = {}
        data.forEach(user => {
          phonesMap[user.id] = user.phone
        })
        setProducerPhones(phonesMap)
      }
    }

    fetchProducerPhones()
  }, [products])

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory && p.quantity > 0
  })

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
    <Container>
      <PageHeader
        title="🛍️ Catálogo de productos"
        description="Encuentra productos frescos de productores locales"
      />
      
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
        producerPhones={producerPhones}
      />
    </Container>
  )
}
```

## Beneficios de esta Estructura

✅ **Reutilización**: Los componentes UI pueden usarse en cualquier página
✅ **Mantenimiento**: Cambios en un componente base se aplican en toda la app
✅ **Escalabilidad**: Fácil agregar nuevas páginas y funcionalidades
✅ **Testing**: Componentes pequeños y aislados son más fáciles de testear
✅ **Consistencia**: Estilos y comportamientos uniformes en toda la aplicación

## Pasos para Migrar

1. Refactoriza las páginas una por una
2. Importa los componentes nuevos
3. Elimina código HTML duplicado
4. Prueba que todo funcione correctamente
5. Elimina estilos CSS que ya no uses

## Importaciones

```jsx
// Importar componentes individuales
import { Button, Card, Input } from '@/components/ui'
import { LoginForm, RegisterForm } from '@/components/forms'
import { ProductCard, ProductGrid } from '@/components/product'
import { MainLayout, Container, PageHeader } from '@/components/layout'

// O importar todo desde components
import { Button, Card, LoginForm, ProductGrid, Container } from '@/components'
```

## Próximos Pasos

1. **Refactorizar todas las páginas** usando estos componentes
2. **Crear más componentes reutilizables** según sea necesario:
   - Modal/Dialog
   - Dropdown/Menu
   - Pagination
   - Tabs
   - Breadcrumb
3. **Crear variantes de componentes** para diferentes casos de uso
4. **Documentar componentes** con Storybook (opcional pero recomendado)
