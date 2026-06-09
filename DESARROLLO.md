# Guía de Desarrollo - Mercado Campesino Digital

## 📁 Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   └── Navbar.jsx
├── pages/           # Páginas/rutas
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Catalog.jsx
│   ├── CreateProduct.jsx
│   ├── ProducerDashboard.jsx
│   └── AdminDashboard.jsx
├── stores/          # Zustand stores (estado global)
│   ├── authStore.js
│   └── productStore.js
├── lib/            # Librerías/configuraciones
│   └── supabase.js
├── utils/          # Funciones auxiliares
│   └── whatsapp.js
├── styles/         # CSS y Tailwind
│   └── index.css
├── App.jsx         # Componente principal
└── main.jsx        # Entry point
```

## 🎨 Componentes principales

### Home.jsx
- Landing page
- Información del proyecto
- Enlaces a login/register

### Login.jsx / Register.jsx
- Autenticación con Supabase
- Selección de rol (producer/consumer)
- Gestión de errores

### Catalog.jsx
- Listado de productos
- Búsqueda y filtrado
- Integración WhatsApp para pedidos

### CreateProduct.jsx
- Formulario para publicar productos
- Validación de datos
- Upload de imagen (URL)

### ProducerDashboard.jsx
- Mis productos
- Botón para crear nuevo producto
- Edición/eliminación

### AdminDashboard.jsx
- Estadísticas
- Validación de usuarios
- Monitoreo

## 🔄 Flujo de estado (Zustand)

### authStore.js
```javascript
{
  user,           // Usuario autenticado
  role,           // Rol del usuario
  loading,        // Estado de carga
  error,          // Mensajes de error
  signUp,         // Registrar usuario
  signIn,         // Iniciar sesión
  signOut,        // Cerrar sesión
  initializeAuth  // Cargar sesión al iniciar
}
```

### productStore.js
```javascript
{
  products,       // Lista de productos
  loading,        // Estado de carga
  error,          // Mensajes de error
  fetchProducts,  // Cargar todos
  fetchProductById, // Cargar uno
  addProduct,     // Crear
  deleteProduct   // Eliminar
}
```

## 🚀 Cómo agregar nuevas funciones

### Agregar una nueva página

1. Crear archivo en `src/pages/NuevaPage.jsx`
2. Agregar ruta en `App.jsx`:
```jsx
<Route path="/nueva-page" element={<NuevaPage />} />
```

### Agregar un nuevo store

1. Crear archivo en `src/stores/nuevoStore.js`
2. Usar el mismo patrón que `authStore.js`
3. Importar en el componente:
```jsx
const { data, loading, fetchData } = useNuevoStore()
```

### Agregar campos en una tabla

1. En Supabase SQL Editor:
```sql
ALTER TABLE products ADD COLUMN nuevo_campo TEXT;
```
2. Actualizar tipos en el store
3. Actualizar formularios en componentes

## 🔌 Integración con Supabase

### Crear datos
```javascript
const { data, error } = await supabase
  .from('products')
  .insert([{ name: 'Tomate', price: 5 }])
  .select()
```

### Leer datos
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
```

### Actualizar
```javascript
const { data, error } = await supabase
  .from('products')
  .update({ price: 6 })
  .eq('id', id)
```

### Eliminar
```javascript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', id)
```

## 📱 WhatsApp Integration

### En Catalog.jsx
```javascript
import { openWhatsApp } from '@/utils/whatsapp'

// Cuando el usuario hace click en "Hacer pedido"
const handleOrder = (product) => {
  openWhatsApp(producerPhone, {
    productName: product.name,
    quantity: 1,
    price: product.price,
    totalPrice: product.price
  })
}
```

### Editar mensaje en whatsapp.js
```javascript
const message = `Hola, quiero pedir:
Producto: ${productName}
Cantidad: ${quantity}`
```

## 🎯 Flujo de un usuario

### Consumidor
1. Registrarse (email + password)
2. Ir a `/catalog`
3. Ver productos
4. Click "Hacer pedido"
5. Se abre WhatsApp Web
6. Enviar mensaje al productor

### Productor
1. Registrarse como productor
2. Ir a `/producer`
3. Click "Nuevo producto"
4. Llenar formulario
5. Click "Publicar oferta"
6. Producto aparece en el catálogo
7. Recibe WhatsApp cuando alguien hace pedido

## 🛡️ Validaciones

### Frontend (React)
- Campos requeridos
- Email válido
- Contraseñas coincidan
- Precio > 0

### Backend (Supabase)
- CHECK constraints en BD
- RLS policies
- Triggers para updated_at

## 🧪 Testing manual

```bash
# 1. Iniciar en desarrollo
npm run dev

# 2. Ir a http://localhost:3000

# 3. Crear cuenta consumidor
- Email: consumer@test.com
- Password: Test123!

# 4. Crear cuenta productor (otra ventana)
- Email: producer@test.com
- Password: Test123!
- Role: Productor

# 5. Productor publica producto

# 6. Consumidor ve catálogo

# 7. Consumidor hace pedido por WhatsApp
```

## 📦 Build y deploy

### Compilar
```bash
npm run build
```

### Preview de producción
```bash
npm run preview
```

### Deploy a Vercel
```bash
npm i -g vercel
vercel --prod
```

## 🐛 Debugging

- Abrir DevTools: F12
- Console: ver logs de la app
- Network: ver llamadas a Supabase
- Storage: ver localStorage y sesión

## 🔐 Variables de entorno

Crear `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

**NUNCA** committear `.env.local` (está en .gitignore)

## 📚 Recursos

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Router Docs](https://reactrouter.com)

## ❓ FAQ

**P: ¿Cómo agregar más campos a los productos?**
R: 1) ALTER TABLE en Supabase 2) Actualizar formulario en CreateProduct 3) Actualizar Catalog

**P: ¿Cómo cambiar colores?**
R: Editar `tailwind.config.js` → theme.colors

**P: ¿Cómo agregar un nuevo rol?**
R: 1) Crear política RLS en Supabase 2) Actualizar authStore 3) Agregar rutas protegidas en App.jsx
