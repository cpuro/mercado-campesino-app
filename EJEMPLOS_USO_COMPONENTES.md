# 🎯 Ejemplos de Uso de Componentes

## Componentes UI

### Button

```jsx
import { Button } from '@/components'

// Variantes
<Button variant="primary">Botón primario</Button>
<Button variant="secondary">Botón secundario</Button>
<Button variant="danger">Eliminar</Button>
<Button variant="ghost">Acción secundaria</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>

// Estados
<Button disabled>Deshabilitado</Button>
<Button loading>Cargando...</Button>
<Button fullWidth>Ancho completo</Button>

// Con onClick
<Button onClick={() => console.log('Clicked')}>
  Click me
</Button>
```

### Card

```jsx
import { Card } from '@/components'

// Simple
<Card>
  <h3>Contenido de la tarjeta</h3>
  <p>Texto de descripción</p>
</Card>

// Hoverable
<Card hoverable>
  <img src="..." alt="..." />
  <h3>Producto</h3>
</Card>

// Con clase personalizada
<Card className="bg-blue-50">
  Contenido especial
</Card>
```

### Input

```jsx
import { Input } from '@/components'

// Simple
<Input placeholder="Escribe aquí..." />

// Con label y validación
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  required
  error="Email inválido"
/>

// Diferentes tipos
<Input type="text" label="Nombre" />
<Input type="email" label="Email" />
<Input type="password" label="Contraseña" />
<Input type="number" label="Cantidad" />

// Tamaños
<Input size="sm" placeholder="Pequeño" />
<Input size="md" placeholder="Mediano" />
<Input size="lg" placeholder="Grande" />
```

### Select

```jsx
import { Select } from '@/components'

// Simple
<Select
  options={[
    { value: 'opt1', label: 'Opción 1' },
    { value: 'opt2', label: 'Opción 2' },
  ]}
/>

// Con label y validación
<Select
  label="Categoría"
  required
  error="Selecciona una categoría"
  options={[
    { value: '', label: 'Selecciona...' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'vegetales', label: 'Vegetales' },
  ]}
/>
```

### Alert

```jsx
import { Alert } from '@/components'

// Tipos diferentes
<Alert type="success" message="¡Operación exitosa!" />
<Alert type="error" message="Ocurrió un error" />
<Alert type="warning" message="Advertencia importante" />
<Alert type="info" message="Información útil" />

// Con título
<Alert
  type="error"
  title="Error de validación"
  message="El email no es válido"
/>

// Con cierre
<Alert
  type="success"
  message="¡Éxito!"
  onClose={() => console.log('Cerrada')}
/>
```

### Badge

```jsx
import { Badge } from '@/components'

// Variantes
<Badge variant="default">Por defecto</Badge>
<Badge variant="primary">Primario</Badge>
<Badge variant="success">Disponible</Badge>
<Badge variant="danger">Agotado</Badge>

// Tamaños
<Badge size="sm">Pequeño</Badge>
<Badge size="md">Mediano</Badge>
<Badge size="lg">Grande</Badge>
```

### Spinner

```jsx
import { Spinner } from '@/components'

// Simple
<Spinner />

// Diferentes tamaños
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// En un contenedor
<div className="flex justify-center">
  <Spinner size="lg" className="py-12" />
</div>
```

## Componentes de Formularios

### LoginForm

```jsx
import { LoginForm } from '@/components'

<LoginForm
  onSubmit={async (credentials) => {
    // credentials = { email: string, password: string }
    await signIn(credentials.email, credentials.password)
  }}
  error="Email o contraseña incorrectos"
  loading={false}
/>
```

### RegisterForm

```jsx
import { RegisterForm } from '@/components'

<RegisterForm
  onSubmit={async (credentials) => {
    // credentials = { email: string, password: string, role: string }
    await signUp(credentials.email, credentials.password, credentials.role)
  }}
  error={null}
  loading={false}
/>
```

### ProductForm

```jsx
import { ProductForm } from '@/components/forms'

<ProductForm
  onSubmit={async (data) => {
    // data = { name, description, price, quantity, category }
    await saveProduct(data)
  }}
  loading={false}
  error={null}
  onImageChange={(file) => {
    // Manejar imagen seleccionada
  }}
/>
```

### SearchFilter

```jsx
import { SearchFilter } from '@/components'

<SearchFilter
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  categoryFilter={categoryFilter}
  onCategoryChange={setCategoryFilter}
/>
```

## Componentes de Productos

### ProductCard

```jsx
import { ProductCard } from '@/components'

<ProductCard
  product={{
    id: '1',
    name: 'Tomates frescos',
    description: 'Tomates de cultivo local',
    price: 5000,
    quantity: 20,
    category: 'vegetales',
    image_path: 'products/...',
    producer_id: 'prod-1',
  }}
  onOrder={(product) => {
    // Manejar orden
  }}
  producerPhone="+34123456789"
/>
```

### ProductGrid

```jsx
import { ProductGrid } from '@/components'

<ProductGrid
  products={products}
  loading={loading}
  onOrder={handleOrder}
  producerPhones={producerPhones}
/>
```

### ProductImage

```jsx
import { ProductImage } from '@/components'

// Pequeña
<ProductImage product={product} className="w-32 h-32" />

// Mediana
<ProductImage product={product} className="w-64 h-64" />

// Grande (completa)
<ProductImage product={product} className="w-full h-96" />
```

### OrderButton

```jsx
import { OrderButton } from '@/components'

<OrderButton
  product={product}
  producerPhone={producerPhone}
  variant="primary"
/>
```

## Componentes de Layout

### MainLayout

```jsx
import { MainLayout } from '@/components'

<MainLayout>
  <div>Contenido de la página</div>
</MainLayout>
// Incluye Navbar y Footer automáticamente
```

### Container

```jsx
import { Container } from '@/components'

<Container>
  <h1>Mi página</h1>
  <p>Contenido limitado a max-width</p>
</Container>

// Con clase personalizada
<Container className="py-12">
  Contenido con padding personalizado
</Container>
```

### PageHeader

```jsx
import { PageHeader } from '@/components'

// Simple
<PageHeader
  title="Catálogo"
  description="Productos disponibles"
/>

// Con acciones
<PageHeader
  title="Productos"
  description="Tus productos"
  actions={[
    <Button key="1">Crear nuevo</Button>,
    <Button key="2" variant="secondary">Exportar</Button>,
  ]}
/>
```

### FormCard

```jsx
import { FormCard } from '@/components'

<FormCard description="Inicia sesión en tu cuenta">
  <LoginForm
    onSubmit={handleSubmit}
    error={error}
    loading={loading}
  />
</FormCard>
```

## Ejemplos Completos

### Página de Catálogo Refactorizada

```jsx
import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import {
  ProductGrid,
  Container,
  PageHeader,
} from '@/components'
import { SearchFilter } from '@/components/forms'

export default function Catalog() {
  const { products, loading, fetchProducts } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [producerPhones, setProducerPhones] = useState({})

  useEffect(() => {
    fetchProducts()
    loadProducerPhones()
  }, [])

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm)
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory && p.quantity > 0
  })

  const handleOrder = (product) => {
    // Implementar lógica
  }

  return (
    <Container>
      <PageHeader
        title="🛍️ Catálogo"
        description="Explora productos frescos"
      />

      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </div>

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

### Página de Crear Producto Refactorizada

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/stores/productStore'
import { Container, PageHeader } from '@/components/layout'
import { ProductForm } from '@/components/forms'

export default function CreateProduct() {
  const navigate = useNavigate()
  const { addProduct, loading } = useProductStore()
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (productData) => {
    try {
      const result = await addProduct({
        ...productData,
        image_path: imageFile ? await uploadImage(imageFile) : null,
      })
      if (result.success) navigate('/producer')
      else setError(result.error)
    } catch (err) {
      setError(err.message)
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

### Página de Login Refactorizada

```jsx
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FormCard } from '@/components/layout'
import { LoginForm } from '@/components/forms'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading, error } = useAuthStore()

  const handleSubmit = async (credentials) => {
    const result = await signIn(credentials.email, credentials.password)
    if (result.success) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Inicia sesión en tu cuenta">
        <LoginForm
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        />
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  )
}
```

## Patrones Comunes

### Formulario con Validación

```jsx
import { useState } from 'react'
import { Input, Button, Alert } from '@/components'

export default function MyForm() {
  const [data, setData] = useState({ name: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.name || !data.email) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    try {
      await submitForm(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <Input
        label="Nombre"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        required
      />

      <Input
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        required
      />

      <Button type="submit" loading={loading} fullWidth>
        Enviar
      </Button>
    </form>
  )
}
```

### Lista con Búsqueda y Filtro

```jsx
import { useState } from 'react'
import { SearchFilter, Card } from '@/components'

export default function MyList() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (!category || item.category === category)
  )

  return (
    <>
      <SearchFilter
        searchTerm={search}
        onSearchChange={setSearch}
        categoryFilter={category}
        onCategoryChange={setCategory}
      />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {filtered.map(item => (
          <Card key={item.id} hoverable>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
```
