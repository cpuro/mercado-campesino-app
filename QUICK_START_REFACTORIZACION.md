# 🚀 QUICK START: Refactorización de Páginas

## Primeros Pasos (Muy Fácil - 5 minutos por página)

### 1. Refactorizar Login.jsx

#### Antes ❌ (107 líneas)
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Mercado Campesino</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### Después ✅ (29 líneas)
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
    if (result.success) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Inicia sesión en tu cuenta">
        <LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  )
}
```

**⏱️ Tiempo: 5 minutos | Líneas reducidas: 73% ↓**

---

### 2. Refactorizar Register.jsx

#### Antes ❌ (120 líneas)
```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'consumer'
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    const result = await signUp(formData.email, formData.password, formData.role)
    if (result.success) {
      // Redirigir según el rol seleccionado
      if (formData.role === 'producer') {
        navigate('/producer')
      } else if (formData.role === 'consumer') {
        navigate('/catalog')
      } else {
        navigate('/admin')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Mercado Campesino</h1>
          <p className="text-gray-600">Crea una nueva cuenta</p>
        </div>

        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">¿Eres?</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-base"
            >
              <option value="consumer">Consumidor (Quiero comprar)</option>
              <option value="producer">Productor (Quiero vender)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### Después ✅ (31 líneas)
```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FormCard } from '@/components/layout'
import { RegisterForm } from '@/components/forms'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, loading, error } = useAuthStore()

  const handleSubmit = async (credentials) => {
    const result = await signUp(
      credentials.email,
      credentials.password,
      credentials.role
    )
    if (result.success) {
      if (credentials.role === 'producer') navigate('/producer')
      else if (credentials.role === 'consumer') navigate('/catalog')
      else navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Crea una nueva cuenta">
        <RegisterForm onSubmit={handleSubmit} error={error} loading={loading} />
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </FormCard>
    </div>
  )
}
```

**⏱️ Tiempo: 5 minutos | Líneas reducidas: 74% ↓**

---

### 3. Refactorizar Catalog.jsx (Nivel Medio)

#### Idea General: Separar código complejo

**Pasos:**
1. Importar `SearchFilter`, `ProductGrid`
2. Reemplazar el form de búsqueda
3. Reemplazar el grid de productos

```jsx
// Antes: 100+ líneas de JSX
<div className="flex flex-col md:flex-row gap-4 mb-6">
  <input type="text" placeholder="Buscar..." ... />
  <select value={categoryFilter} ... >
    <option value="">Todas las categorías</option>
    ...
  </select>
</div>

{loading ? (
  <div className="flex justify-center">Loading...</div>
) : products.length === 0 ? (
  <p>No products found</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map(product => (
      <div className="card">
        {/* Card content */}
      </div>
    ))}
  </div>
)}

// Después: Solo 2 líneas
<SearchFilter {...props} />
<ProductGrid {...props} />
```

**Ahorro: ~80 líneas de código**

---

### 4. Refactorizar CreateProduct.jsx

#### Antes (Mucho código de formulario)
```jsx
// Formulario largo con muchas validaciones
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-2">Foto</label>
    <input type="file" accept="image/*" ... />
  </div>
  <div>
    <label>Nombre</label>
    <input type="text" ... />
  </div>
  // ... más campos
</form>
```

#### Después (Componente reutilizable)
```jsx
<ProductForm
  onSubmit={handleSubmit}
  loading={loading}
  error={error}
  onImageChange={setImageFile}
/>
```

**Ahorro: ~80 líneas de código**

---

## Orden Recomendado de Refactorización

### Nivel 1️⃣ - FÁCIL (5-10 minutos cada uno)
```
1. Login.jsx           → Usa FormCard + LoginForm
2. Register.jsx        → Usa FormCard + RegisterForm
3. Home.jsx            → Usa Container + PageHeader + Button
```

### Nivel 2️⃣ - MEDIO (10-15 minutos cada uno)
```
4. CreateProduct.jsx   → Usa Container + PageHeader + ProductForm
5. Catalog.jsx         → Usa Container + SearchFilter + ProductGrid
```

### Nivel 3️⃣ - DIFÍCIL (20+ minutos cada uno)
```
6. ProducerDashboard.jsx  → Usa componentes múltiples
7. AdminDashboard.jsx     → Usa componentes múltiples
```

---

## Checklist de Refactorización

### Para cada página:

- [ ] Importar componentes necesarios
- [ ] Remover JSX HTML duplicado
- [ ] Reemplazar con componentes
- [ ] Actualizar props
- [ ] Probar en navegador
- [ ] Verificar responsividad
- [ ] Verificar funcionalidad

### Después de refactorizar todo:

- [ ] Ejecutar `npm run build`
- [ ] Verificar que no hay errores
- [ ] Testing completo en navegador
- [ ] Testing en móvil (responsivo)

---

## Template para Copiar/Pegar

### Página Vacía Lista

```jsx
import { Container, PageHeader } from '@/components/layout'
import { useState, useEffect } from 'react'

export default function MyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Cargar datos
  }, [])

  return (
    <Container>
      <PageHeader
        title="Título"
        description="Descripción"
        actions={[/* botones aquí */]}
      />
      
      {/* Contenido aquí */}
    </Container>
  )
}
```

### Formulario Vacío Lista

```jsx
import { FormCard } from '@/components/layout'
import { MyForm } from '@/components/forms'

export default function MyFormPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      // Tu lógica
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <FormCard description="Descripción">
        <MyForm 
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        />
      </FormCard>
    </div>
  )
}
```

---

## 📝 Notas Importantes

✅ **Antes de empezar:**
- Copia el código original como backup
- Abre dos pestañas: una con la página original, otra editando
- Prueba cada cambio inmediatamente

✅ **Durante la refactorización:**
- Mantén la lógica intacta, solo cambia el JSX
- Los componentes ya tienen validaciones, no duplicles
- Usa `className` para estilos personalizados

✅ **Después de terminar:**
- Verifica que funciona igual que antes
- Comprueba en móvil (responsive)
- No elimines código duplicado en CSS si no estás seguro

---

## Soporte Rápido

| Problema | Solución |
|----------|----------|
| Componente no se importa | Verifica `@/components` (alias en vite.config.js) |
| Props no funciona | Consulta `EJEMPLOS_USO_COMPONENTES.md` |
| Estilo no se aplica | Usa `className` en lugar de `style` |
| Error de tipo | Verifica que estás pasando los datos correctos |

---

**¡Listo! Puedes empezar a refactorizar ahora mismo.** 🚀
