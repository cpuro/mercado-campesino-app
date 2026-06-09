# Ejemplos de Código - Mercado Campesino Digital

Referencia rápida para tareas comunes.

---

## 🔐 Autenticación

### Registrarse
```javascript
import { useAuthStore } from '@/stores/authStore'

export function RegisterForm() {
  const { signUp, loading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signUp(email, password, 'producer')
    if (result.success) {
      // Redirigir a home
    }
  }

  return (
    <>
      {error && <div>{error}</div>}
      <button disabled={loading}>Registrarse</button>
    </>
  )
}
```

### Iniciar sesión
```javascript
const { signIn } = useAuthStore()

const handleLogin = async (email, password) => {
  const result = await signIn(email, password)
  if (result.success) {
    navigate('/')
  }
}
```

### Cerrar sesión
```javascript
const { signOut } = useAuthStore()

const handleLogout = () => {
  signOut()
  navigate('/login')
}
```

### Verificar si está autenticado
```javascript
import { useAuthStore } from '@/stores/authStore'

export function ProtectedPage() {
  const { user, role, loading } = useAuthStore()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  
  return <div>Bienvenido, {user.email}</div>
}
```

---

## 📦 Productos

### Obtener todos los productos
```javascript
import { useProductStore } from '@/stores/productStore'
import { useEffect } from 'react'

export function Catalog() {
  const { products, loading, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Crear un producto
```javascript
const { addProduct } = useProductStore()

const handleCreateProduct = async (formData) => {
  const result = await addProduct({
    name: formData.name,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    description: formData.description,
    category: formData.category,
    image_url: formData.imageUrl,
    producer_id: user.id
  })

  if (result.success) {
    console.log('Producto creado!')
  }
}
```

### Filtrar productos
```javascript
const { products } = useProductStore()

// Por búsqueda
const filtered = products.filter(p =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
)

// Por categoría
const frutas = products.filter(p => p.category === 'frutas')

// Con stock
const available = products.filter(p => p.quantity > 0)
```

---

## 📱 WhatsApp

### Generar enlace de pedido
```javascript
import { openWhatsApp } from '@/utils/whatsapp'

const handleOrder = (product) => {
  openWhatsApp(producerPhone, {
    productName: product.name,
    quantity: 5,
    price: product.price,
    totalPrice: product.price * 5
  })
}
```

### Personalizar mensaje
En `src/utils/whatsapp.js`:
```javascript
const message = `
Hola! Estoy interesado en:
📦 ${productName}
📊 Cantidad: ${quantity}
💰 Total: $${totalPrice}

¿Cuándo puedo recoger?
`
```

---

## 🎨 Tailwind CSS

### Botones
```jsx
// Primario (verde)
<button className="btn-primary">Guardar</button>

// Secundario (ámbar)
<button className="btn-secondary">Comprar</button>

// Ghost (transparente)
<button className="btn-ghost">Cancelar</button>
```

### Cards
```jsx
<div className="card">
  <h3 className="font-bold mb-2">Título</h3>
  <p className="text-gray-600">Contenido</p>
</div>
```

### Grid responsive
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

### Colores personalizados
En `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#10b981',    // Verde
      secondary: '#f59e0b',  // Ámbar
      accent: '#ef4444'      // Rojo
    }
  }
}
```

---

## 🗄️ Supabase (SQL)

### Insertar datos
```javascript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('products')
  .insert([{
    name: 'Tomate',
    price: 5,
    quantity: 10,
    producer_id: userId
  }])
  .select()
```

### Leer datos
```javascript
// Todos
const { data } = await supabase
  .from('products')
  .select('*')

// Con filtro
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'vegetales')
  .gte('quantity', 1)

// Ordenar
const { data } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

### Actualizar
```javascript
const { error } = await supabase
  .from('products')
  .update({ quantity: 5 })
  .eq('id', productId)
```

### Eliminar
```javascript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)
```

---

## 🎯 Zustand Stores

### Crear un nuevo store
```javascript
import { create } from 'zustand'

export const useMyStore = create((set, get) => ({
  // Estado
  data: [],
  loading: false,

  // Acciones
  fetchData: async () => {
    set({ loading: true })
    // ... lógica
    set({ data: result })
  },

  updateData: (newData) => {
    set({ data: newData })
  }
}))
```

### Usar el store
```javascript
import { useMyStore } from '@/stores/myStore'

function MyComponent() {
  const { data, loading, fetchData } = useMyStore()

  useEffect(() => {
    fetchData()
  }, [])

  return <div>{loading ? 'Cargando...' : data}</div>
}
```

---

## 🔀 React Router

### Proteger rutas
```javascript
// En App.jsx
<Route
  path="/producer"
  element={user && role === 'producer' ? <ProducerPage /> : <Navigate to="/" />}
/>
```

### Redireccionar
```javascript
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/catalog')
  }

  return <button onClick={handleClick}>Ir al catálogo</button>
}
```

### Links
```javascript
import { Link } from 'react-router-dom'

<Link to="/catalog" className="btn-primary">Ver catálogo</Link>
```

---

## ⚡ Formularios

### Capturar datos
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  price: ''
})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

return (
  <form onSubmit={handleSubmit}>
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="input-base"
    />
  </form>
)
```

### Validar antes de enviar
```javascript
const handleSubmit = (e) => {
  e.preventDefault()

  if (!formData.name) {
    setError('El nombre es requerido')
    return
  }

  if (formData.price <= 0) {
    setError('El precio debe ser mayor a 0')
    return
  }

  // Enviar datos...
}
```

---

## 🖼️ Imágenes

### Mostrar imagen
```javascript
<img
  src={product.image_url}
  alt={product.name}
  className="w-full h-40 object-cover rounded-lg"
/>
```

### Placeholder si no hay imagen
```javascript
{product.image_url ? (
  <img src={product.image_url} alt={product.name} />
) : (
  <div className="bg-gray-200 h-40 flex items-center justify-center">
    📷 Sin imagen
  </div>
)}
```

---

## 🔔 Mensajes de estado

### Éxito
```javascript
<div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
  ✅ Producto creado exitosamente
</div>
```

### Error
```javascript
<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
  ❌ {error}
</div>
```

### Cargando
```javascript
<div className="text-center py-12">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  <p className="text-gray-600">Cargando...</p>
</div>
```

---

## 📊 Datos comunes

### Estructura de un producto
```javascript
{
  id: 'uuid',
  producer_id: 'uuid',
  name: 'Tomate',
  description: 'Tomates frescos del huerto',
  price: 5.50,
  quantity: 20,
  category: 'vegetales',
  image_url: 'https://...',
  is_active: true,
  created_at: '2024-01-26T10:00:00',
  updated_at: '2024-01-26T10:00:00'
}
```

### Estructura de un usuario
```javascript
{
  id: 'uuid',
  email: 'producer@example.com',
  name: 'Juan Pérez',
  phone: '+34123456789',
  address: 'Calle Principal 123',
  role: 'producer', // o 'consumer', 'admin'
  is_verified: true,
  avatar_url: 'https://...',
  created_at: '2024-01-26T10:00:00'
}
```

---

## 🚀 Performance

### Lazy loading de componentes
```javascript
import { lazy, Suspense } from 'react'

const Catalog = lazy(() => import('@/pages/Catalog'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Catalog />
    </Suspense>
  )
}
```

### Memoizar componentes
```javascript
import { memo } from 'react'

const ProductCard = memo(({ product }) => (
  <div className="card">
    <h3>{product.name}</h3>
  </div>
))

export default ProductCard
```

---

## 🐛 Debug

### Ver estado en consola
```javascript
import { useAuthStore } from '@/stores/authStore'

function DebugComponent() {
  const state = useAuthStore()
  console.log('Auth state:', state)
  return null
}
```

### Verificar datos de Supabase
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')

console.log('Data:', data)
console.log('Error:', error)
```

---

**Más ejemplos en:**
- [DESARROLLO.md](./DESARROLLO.md) - Arquitectura completa
- [README.md](./README.md) - Features y setup
