# Mercado Campesino Digital

Plataforma web de comercialización directa para productores rurales y consumidores urbanos.

## 🎯 Características principales

### Para Productores
- ✅ Registro sencillo
- ✅ Carga de productos con foto, nombre, precio y cantidad
- ✅ Botón "Publicar oferta"
- ✅ Panel de control de productos

### Para Consumidores
- ✅ Catálogo en tiempo real
- ✅ Búsqueda y filtrado de productos
- ✅ Botón "Hacer pedido" → WhatsApp automático
- ✅ Notificaciones de nuevas ofertas

### Para Administrador
- ✅ Validación manual de usuarios
- ✅ Monitoreo de uso
- ✅ Estadísticas

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling
- **PWA** - Offline support, instalación como app
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Supabase** - PostgreSQL + Auth + Hosting
- **Service Workers** - Offline functionality

### Integraciones
- **WhatsApp Web (wa.me)** - Pedidos automáticos (sin APIs pagas)

## 📋 Requisitos previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
cd app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Obtener estas claves desde tu proyecto Supabase:
- Ir a Settings → API en el dashboard de Supabase
- Copiar `Project URL` y `anon public key`

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## 🗄️ Estructura de la base de datos (Supabase)

### Tabla: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('producer', 'consumer', 'admin')),
  name TEXT,
  phone TEXT,
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  consumer_id UUID REFERENCES users(id),
  producer_id UUID REFERENCES users(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📦 Compilar para producción
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 🌐 Deploy

### Opción 1: Vercel (recomendado para Vite)
```bash
npm i -g vercel
vercel
```

### Opción 2: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Opción 3: GitHub Pages
Configurar en `vite.config.js`:
```js
export default {
  base: '/nombre-repo/',
  // ... resto de config
}
```

## 📱 PWA - Instalación como app

La app se puede instalar como PWA en cualquier navegador moderno:
- **Desktop**: Click en el icono de instalación (Chrome, Edge, Brave)
- **Mobile**: Click en "Compartir" → "Agregar a pantalla de inicio"

## 🔗 Integraciones

### WhatsApp
Los pedidos se envían automáticamente a través de `wa.me` (sin APIs pagas).

Estructura del mensaje automático:
```
Hola, quiero pedir:
Producto: Tomate
Cantidad: 5 kg
Precio: $X
Total: $Y
```

## 📝 Flujo de uso

### Productor
1. Registrarse como productor
2. Esperar validación del admin (opcional)
3. Publicar productos
4. Recibir pedidos por WhatsApp
5. Confirmar entrega

### Consumidor
1. Registrarse como consumidor
2. Explorar catálogo
3. Buscar/filtrar productos
4. Click "Hacer pedido"
5. Confirmar en WhatsApp

## 🛡️ Seguridad

- Autenticación con Supabase Auth
- Validación en servidor
- Variables de entorno protegidas
- HTTPS en producción (obligatorio)

## 📊 Métricas esperadas (Fase MVP)
- 30 productores publicando ofertas
- 100+ consumidores
- Canal de pedidos funcionando 24/7
- 0 costos de transacción

## 🚧 Roadmap (Fase 2)
- [ ] Login con Google/WhatsApp
- [ ] Integración de pagos (Stripe/PayPal)
- [ ] Sistema de calificaciones
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Reportes administrativos

## 📞 Soporte

Para reportar errores o sugerir mejoras, abre una issue en el repositorio.

## 📄 Licencia

MIT License - Ver LICENSE.md para más detalles.

---

**Hecho con ❤️ para conectar productores rurales con consumidores urbanos.**
