# INICIO RÁPIDO - Mercado Campesino Digital

## ✅ Pasos para empezar

### Paso 1: Instalar dependencias
```bash
cd "c:\Users\USUARIO\Documents\PASO A PASO - CREACION APP MERCADO\APP"
npm install
```

### Paso 2: Crear cuenta en Supabase
1. Ir a https://supabase.com
2. Click "Start your project"
3. Crear proyecto nuevo
4. Esperar a que se cree la BD

### Paso 3: Obtener credenciales
En Supabase Dashboard:
- Settings → API
- Copiar:
  - **Project URL** 
  - **anon public key**

### Paso 4: Crear archivo .env.local
En la carpeta `APP`, crear archivo `.env.local`:

```
VITE_SUPABASE_URL=<tu-url-aqui>
VITE_SUPABASE_ANON_KEY=<tu-key-aqui>
```

### Paso 5: Crear tablas en Supabase

Ir a Supabase → SQL Editor → New Query

Copiar y ejecutar el contenido de `SETUP_SUPABASE.md`

### Paso 6: Iniciar en desarrollo
```bash
npm run dev
```

La app se abrirá en http://localhost:3000

## 🎯 Probar la app

### Crear usuario consumidor
1. Click "Regístrate"
2. Email: `consumer@test.com`
3. Password: `Test123!`
4. Rol: "Consumidor"
5. Click "Registrarse"

### Crear usuario productor
1. Abre otra pestaña/ventana
2. Click "Regístrate"  
3. Email: `producer@test.com`
4. Password: `Test123!`
5. Rol: "Productor"
6. Click "Registrarse"

### Productor publica un producto
1. En la ventana del productor, click "Mi panel de productor"
2. Click "Nuevo producto"
3. Llena el formulario:
   - Nombre: "Tomates frescos"
   - Descripción: "Tomates del jardín"
   - Precio: "5"
   - Cantidad: "20"
4. Click "Publicar oferta"

### Consumidor hace un pedido
1. En la ventana del consumidor, click "Catálogo"
2. Deberías ver el producto del productor
3. Click "Hacer pedido por WhatsApp"
4. Se abrirá WhatsApp Web con un mensaje automático

## 📱 Instalación como PWA

### En Chrome/Edge/Brave
- Click en el icono de instalación (arriba a la derecha)
- "Instalar"

### En móvil
- Click en "Compartir"
- "Agregar a pantalla de inicio"

La app funcionará offline y como app nativa.

## 🛠️ Comandos útiles

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción local
npm run preview
```

## 📝 Notas importantes

- El archivo `.env.local` NO se commitea (está en .gitignore)
- Guarda bien tus credenciales de Supabase
- La primera vez que abras la app en desarrollo, npm install toma unos minutos
- Si hay problemas de CORS, configura en Supabase → Authentication → Settings

## ❓ Problemas comunes

**Error: Cannot find module '@supabase/supabase-js'**
→ Ejecuta `npm install`

**Error: VITE_SUPABASE_URL is not defined**
→ Crea `.env.local` con las credenciales

**No carga la app en http://localhost:3000**
→ Asegúrate que npm run dev esté ejecutándose

**WhatsApp no abre**
→ El número de teléfono debe estar en formato internacional

## 🚀 Próximos pasos

1. [Leer DESARROLLO.md](./DESARROLLO.md) para entender la arquitectura
2. [Leer README.md](./README.md) para features completas
3. Customizar colores en `tailwind.config.js`
4. Agregar más campos a productos
5. Deployr a Vercel o Netlify

---

¡Listo! Tu app ya está lista para empezar a desarrollar. 🎉
