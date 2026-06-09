# 🏗️ ENTREGABLE 4: ARQUITECTURA TÉCNICA
## Documento de Arquitectura - Mercado Campesino Digital

---

## 📌 RESUMEN EJECUTIVO

La aplicación **Mercado Campesino Digital** está construida con una **arquitectura moderna de capas** que separa claramente:
- **Presentación** (UI React)
- **Lógica de negocio** (Services)
- **Estado** (Zustand)
- **Backend** (Supabase)

Esta arquitectura garantiza mantenibilidad, escalabilidad y facilita el testing.

---

## 🏛️ DIAGRAMA DE ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB (Cliente)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              COMPONENTES REACT (UI)                   │  │
│  │  Home.jsx, Login.jsx, Register.jsx, Catalog.jsx      │  │
│  │  ProducerDashboard.jsx, CreateProduct.jsx, Admin.jsx │  │
│  └────────────────┬────────────────────────────────────┬┘  │
│                   │                                    │     │
│  ┌────────────────▼──────────────┐    ┌───────────────▼──┐ │
│  │    ZUSTAND STATE STORES       │    │  CUSTOM HOOKS    │ │
│  │  - authStore                  │    │  - useForm       │ │
│  │  - productStore               │    │  - useImageUp    │ │
│  └────────────────┬──────────────┘    │  - useOrder      │ │
│                   │                    └────────┬─────────┘ │
│                   │                            │            │
│  ┌────────────────▼────────────────────────────▼──────────┐ │
│  │           SERVICES LAYER (Lógica)                      │ │
│  │  - authService.js   (login, registro, logout)         │ │
│  │  - productService.js (CRUD productos, búsqueda)       │ │
│  │  - orderService.js   (gestión de pedidos)             │ │
│  └────────────────┬─────────────────────────────────────┘ │
│                   │                                         │
│                   │ HTTP / REST API                         │
└───────────────────┼─────────────────────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │   SUPABASE        │
          │   ┌─────────────┐ │
          │   │ PostgreSQL  │ │
          │   │  Database   │ │
          │   │             │ │
          │   │ • users     │ │
          │   │ • products  │ │
          │   │ • auth      │ │
          │   └─────────────┘ │
          │                   │
          │ ┌─────────────┐   │
          │ │   Storage   │   │
          │ │  (Imágenes) │   │
          │ └─────────────┘   │
          │                   │
          │ ┌─────────────┐   │
          │ │Auth Server  │   │
          │ │(JWT Token)  │   │
          │ └─────────────┘   │
          └───────────────────┘
```

---

## 📦 ESTRUCTURA DE CARPETAS

```
src/
├── components/           # Componentes React reutilizables
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── index.js
│   ├── forms/            # Componentes de formularios
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProfileForm.jsx
│   ├── layout/           # Componentes de layout
│   │   ├── FormCard.jsx
│   │   └── Container.jsx
│   ├── product/          # Componentes de producto
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   └── ProductDetail.jsx
│   └── ui/               # Componentes UI genéricos
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── Toast.jsx
│
├── hooks/                # Custom Hooks (lógica React)
│   ├── index.js
│   ├── useForm.js        # Manejo de formularios
│   ├── useImageUpload.js # Upload de imágenes
│   ├── useOrder.js       # Gestión de pedidos
│   ├── useProductFilter.js # Filtrado de productos
│   └── useProducerPhones.js # Teléfonos de productores
│
├── services/             # Lógica de negocio (no UI)
│   ├── authService.js    # Autenticación
│   ├── productService.js # Productos
│   ├── orderService.js   # Pedidos
│   └── storageService.js # Imágenes
│
├── stores/               # Estado global (Zustand)
│   ├── authStore.js      # Estado de autenticación
│   └── productStore.js   # Estado de productos
│
├── pages/                # Páginas (componentes principales)
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Catalog.jsx
│   ├── CreateProduct.jsx
│   ├── ProducerDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
│
├── lib/                  # Configuración y utilidades
│   └── supabase.js       # Cliente de Supabase
│
├── utils/                # Funciones utilitarias
│   ├── storage.js        # URLs de imágenes
│   ├── whatsapp.js       # Integración WhatsApp
│   └── validators.js     # Validaciones
│
├── styles/               # Estilos CSS globales
│
├── App.jsx               # Componente raíz + Router
├── main.jsx              # Entry point
└── index.html            # HTML principal
```

---

## 🔄 FLUJO DE DATOS

### FLUJO 1: Autenticación (Login/Registro)

```
Usuario escriba email/password
         ↓
Componente (Login.jsx)
         ↓
useAuthStore() → signIn()
         ↓
authService.signIn()
         ↓
supabase.auth.signInWithPassword()
         ↓
PostgreSQL (auth.users)
         ↓
Retorna: {user, role, token}
         ↓
Zustand actualiza estado
         ↓
Componente re-renderiza
         ↓
Navega según rol
         ↓
✅ Usuario autenticado
```

### FLUJO 2: Crear Producto

```
Productor llena formulario
         ↓
CreateProduct.jsx
         ↓
useProductStore() → createProduct()
         ↓
productService.createProduct()
         ↓
uploadImage() → Supabase Storage
         ↓
Inserta en PostgreSQL (products table)
         ↓
Retorna producto creado
         ↓
Zustand actualiza lista
         ↓
Toast: "✅ Producto creado"
         ↓
Navega a /producer
         ↓
✅ Producto visible en dashboard
```

### FLUJO 3: Ver Catálogo y Buscar

```
Consumidor accede a /catalog
         ↓
Catalog.jsx
         ↓
useProductStore() → fetchProducts()
         ↓
productService.fetchProducts()
         ↓
SELECT * FROM products WHERE quantity > 0
         ↓
Retorna lista de productos
         ↓
Zustand: state.products = [...]
         ↓
Componente renderiza grid
         ↓
Usuario escribe en búsqueda
         ↓
Filtra en tiempo real (lado cliente)
         ↓
Grid se actualiza
         ↓
✅ Búsqueda funciona
```

### FLUJO 4: Hacer Pedido

```
Consumidor ve producto en catálogo
         ↓
Click "Hacer pedido por WhatsApp"
         ↓
openWhatsApp(product, producerPhone)
         ↓
Valida que phone existe
         ↓
Genera mensaje automático
         ↓
Abre: wa.me/PHONE?text=MENSAJE
         ↓
WhatsApp Web se abre
         ↓
Chat con productor
         ↓
Mensaje prefabricado aparece
         ↓
Usuario envía
         ↓
✅ Pedido iniciado (vía WhatsApp)
```

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tabla: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,                    -- De auth.users
  email VARCHAR(255) UNIQUE NOT NULL,     -- Email
  first_name VARCHAR(100),                -- Nombre
  last_name VARCHAR(100),                 -- Apellido
  phone VARCHAR(20),                      -- WhatsApp del productor
  role VARCHAR(50),                       -- admin, producer, consumer
  created_at TIMESTAMP DEFAULT NOW(),     -- Fecha creación
  updated_at TIMESTAMP DEFAULT NOW()      -- Fecha actualización
);
```

### Tabla: products

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID NOT NULL,              -- FK a users
  name VARCHAR(200) NOT NULL,             -- Nombre producto
  description TEXT,                       -- Descripción
  price DECIMAL(10, 2) NOT NULL,          -- Precio
  quantity INT NOT NULL,                  -- Cantidad disponible
  category VARCHAR(100),                  -- Vegetales, Frutas, etc
  image_url VARCHAR(500),                 -- URL de imagen
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (producer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabla: orders (Futuro)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL,              -- FK a users
  producer_id UUID NOT NULL,              -- FK a users
  product_id UUID NOT NULL,               -- FK a products
  quantity INT NOT NULL,                  -- Cantidad pedida
  total_price DECIMAL(10, 2),             -- Precio total
  status VARCHAR(50),                     -- pending, confirmed, delivered
  notes TEXT,                             -- Notas especiales
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (consumer_id) REFERENCES users(id),
  FOREIGN KEY (producer_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Relaciones

```
users (1) ──────→ (N) products
        |
        └──────→ (N) orders (como consumer)
        └──────→ (N) orders (como producer)

products (1) ──────→ (N) orders
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Flujo de Seguridad

```
1. REGISTRO
   Usuario → Email + Password
         ↓
   Validaciones:
   - Email válido
   - Password 8+ caracteres
   - Password sin duplicar
         ↓
   Supabase Auth
   - Hash contraseña (bcrypt)
   - Crear usuario en auth.users
   - Ejecutar trigger → inserta en users table
   - Genera JWT token
         ↓
   ✅ Usuario creado con rol


2. LOGIN
   Usuario → Email + Password
         ↓
   Supabase Auth.signInWithPassword()
   - Verifica email existe
   - Verifica password correcto
   - Genera sesión
   - Retorna JWT token
         ↓
   Almacena:
   - JWT token en memoria/localStorage
   - Usuario en Zustand
   - Rol en Zustand
         ↓
   ✅ Sesión activa


3. RECUPERACIÓN DE SESIÓN
   App carga
         ↓
   Verifica: ¿Token en localStorage?
   Verifica: ¿Sesión válida?
         ↓
   Sí → Restaura usuario + rol
   No → Usuario = null
         ↓
   ✅ Sesión recuperada o vacía
```

### Protección de Rutas

```javascript
// Ejemplo: Solo productores pueden ver /producer
<Route
  path="/producer"
  element={user && role === 'producer' ? <ProducerDashboard /> : <Navigate to="/" />}
/>
```

---

## 📡 INTEGRACIÓN CON SUPABASE

### Cliente Supabase

**Archivo**: `lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export { supabase }
```

### Operaciones Básicas

```javascript
// AUTH
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()
supabase.auth.getSession()

// DATABASE
supabase.from('products').select()
supabase.from('products').insert()
supabase.from('products').update()
supabase.from('products').delete()

// STORAGE
supabase.storage.from('images').upload()
supabase.storage.from('images').getPublicUrl()
```

---

## 🎨 STACK TECNOLÓGICO

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.2.0 | Librería UI |
| Vite | 7.3.1 | Build tool |
| React Router | 6.20.0 | Enrutamiento |
| TailwindCSS | 3.3.6 | Estilos |
| Zustand | 4.4.1 | Estado global |
| React Icons | 5.6.0 | Iconografía |

### Backend

| Tecnología | Uso |
|-----------|-----|
| Supabase | BaaS |
| PostgreSQL | Base de datos |
| JWT | Autenticación |
| Storage S3 | Imágenes |

### Herramientas

| Herramienta | Uso |
|------------|-----|
| Node.js | Runtime |
| npm | Gestión paquetes |
| ESLint | Linting |
| PostCSS | Procesamiento CSS |

---

## 🔌 COMPONENTES CLAVE

### authStore (Zustand)

```javascript
interface AuthStore {
  // Estado
  user: User | null
  role: 'admin' | 'producer' | 'consumer'
  loading: boolean
  error: string | null

  // Acciones
  signUp(email, password, role)
  signIn(email, password)
  signOut()
  initializeAuth()
}
```

### productStore (Zustand)

```javascript
interface ProductStore {
  // Estado
  products: Product[]
  filteredProducts: Product[]
  loading: boolean
  error: string | null

  // Acciones
  fetchProducts()
  createProduct(data)
  updateProduct(id, data)
  deleteProduct(id)
  setFilter(criteria)
}
```

### authService

```javascript
class AuthService {
  signUp(email, password, role) → Promise
  signIn(email, password) → Promise
  signOut() → Promise
  resetPassword(email) → Promise
  getCurrentSession() → Promise
  validateEmail(email) → boolean
  validatePassword(password) → boolean
}
```

### productService

```javascript
class ProductService {
  fetchProducts(filter) → Promise
  fetchProductById(id) → Promise
  fetchProducerProducts(producerId) → Promise
  createProduct(data) → Promise
  updateProduct(id, data) → Promise
  deleteProduct(id) → Promise
  uploadImage(file) → Promise
}
```

---

## 🎯 PATRONES DE DISEÑO UTILIZADOS

### 1. Service Layer Pattern
- Separación de lógica de negocio
- Reutilizable desde cualquier componente
- Fácil de testear

### 2. Store Pattern (Zustand)
- Estado global centralizado
- Actualización eficiente
- Minimal boilerplate

### 3. Custom Hooks
- Lógica reutilizable
- Separación de concerns
- Composición de componentes

### 4. Componentes Funcionales
- Hooks en lugar de clases
- Más fáciles de entender
- Mejor rendimiento

### 5. Factory Pattern
- Creación de productos
- Instancias consistentes
- Validación centralizada

---

## 📊 DECISIONES ARQUITECTÓNICAS

| Decisión | Razón | Alternativa |
|----------|-------|-------------|
| **React** | Popular, comunidad grande | Vue, Angular |
| **Vite** | Fast build, HMR rápido | Webpack, Parcel |
| **Zustand** | Ligero, simple | Redux, Recoil |
| **Supabase** | BaaS completo, PostgreSQL | Firebase, AWS |
| **TailwindCSS** | Utility-first, productivo | Bootstrap, styled-components |

---

## 🚀 ESCALABILIDAD

### Horizontal
- Separación de services permite paralelizar
- Servicios pueden ejecutarse en workers
- API puede escalarse en servidor

### Vertical
- Componentes pueden optimizarse
- Lazy loading de rutas
- Code splitting automático

### Bases de Datos
- PostgreSQL escalable
- Índices en campos de búsqueda
- Paginación para listados grandes

---

## 🔍 PERFORMANCE

### Optimizaciones Implementadas
- ✅ Code splitting (Vite)
- ✅ Lazy loading de rutas
- ✅ Memoización de componentes
- ✅ Compresión de imágenes
- ✅ Caché de datos

### Monitoreo
- DevTools de React
- Network tab del navegador
- Console errors/warnings

---

## 🧪 TESTING

### Estrategia (Para Implementar)
1. **Unit Tests**: Services, Utils
2. **Component Tests**: Componentes React
3. **Integration Tests**: Flujos completos
4. **E2E Tests**: Casos de usuario

### Herramientas Recomendadas
- Jest para unit tests
- React Testing Library para componentes
- Cypress para E2E

---

## 📝 CONVENCIONES DE CÓDIGO

### Nombres de Archivos
- Componentes: `PascalCase.jsx`
- Hooks: `useMyHook.js`
- Services: `myService.js`
- Stores: `myStore.js`
- Utils: `myUtil.js`

### Convenciones de Código
```javascript
// Services
class MyService {
  async method() { }
}

// Hooks
function useMyHook() {
  // Hook logic
}

// Stores
const useMyStore = create((set) => ({
  state: value,
  action: () => set({})
}))
```

---

## 📚 DEPENDENCIAS PRINCIPALES

```json
{
  "@supabase/supabase-js": "^2.38.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "zustand": "^4.4.1",
  "tailwindcss": "^3.3.6",
  "react-icons": "^5.6.0"
}
```

---

## 🔗 FLUJOS DE INTEGRACIÓN

### Con Sistemas Externos

```
1. Supabase Auth
   → POST /auth/v1/signup
   → POST /auth/v1/token?grant_type=password

2. Supabase Database
   → REST API en https://PROJECT.supabase.co

3. Supabase Storage
   → Upload: POST /storage/v1/object
   → Download: GET /storage/v1/object/public/bucket/file

4. WhatsApp Web
   → wa.me/PHONE?text=MESSAGE
   → Abre en navegador/móvil
```

---

## 📈 DIAGRAMA DE ESTADOS

```
USUARIO
  ├─ No autenticado
  │   ├─ En home
  │   ├─ En login
  │   └─ En register
  │
  └─ Autenticado
      ├─ Consumidor
      │   ├─ En catálogo
      │   ├─ Viendo producto
      │   └─ Haciendo pedido
      │
      ├─ Productor
      │   ├─ En panel
      │   ├─ Editando perfil
      │   ├─ Creando producto
      │   └─ Gestionando productos
      │
      └─ Admin
          ├─ En panel admin
          └─ Viendo estadísticas
```

---

## 💡 FUTURAS MEJORAS ARQUITECTÓNICAS

1. **API Gateway**
   - Centralizar llamadas a Supabase
   - Manejo de errores global

2. **Socket.io para Real-time**
   - Notificaciones en tiempo real
   - Chat integrado

3. **Redux DevTools**
   - Debugging del estado
   - Time travel

4. **GraphQL**
   - Queries más eficientes
   - Menos overfetching

5. **Testing Framework Completo**
   - Jest + React Testing Library
   - Coverage > 80%

---

**Arquitectura versión**: 1.0
**Última actualización**: Junio 2026
**Estado**: Producción Ready MVP
