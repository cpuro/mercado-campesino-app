# ✅ VERIFICADOR DE SETUP - Mercado Campesino Digital

Usa esta lista para asegurarte de que todo está configurado correctamente.

---

## 🔍 Verificación de archivos

### Core files
- [ ] `package.json` - Dependencias
- [ ] `vite.config.js` - Config Vite
- [ ] `tailwind.config.js` - Config Tailwind
- [ ] `tsconfig.json` - TypeScript config
- [ ] `index.html` - HTML principal

### Componentes
- [ ] `src/App.jsx` - Router
- [ ] `src/main.jsx` - Entry
- [ ] `src/components/Navbar.jsx` - Navegación
- [ ] `src/pages/Home.jsx` - Home
- [ ] `src/pages/Login.jsx` - Login
- [ ] `src/pages/Register.jsx` - Register
- [ ] `src/pages/Catalog.jsx` - Catálogo
- [ ] `src/pages/CreateProduct.jsx` - Crear producto
- [ ] `src/pages/ProducerDashboard.jsx` - Panel productor
- [ ] `src/pages/AdminDashboard.jsx` - Panel admin

### Estado
- [ ] `src/stores/authStore.js` - Auth
- [ ] `src/stores/productStore.js` - Productos

### Integraciones
- [ ] `src/lib/supabase.js` - Cliente Supabase
- [ ] `src/utils/whatsapp.js` - WhatsApp

### Estilos
- [ ] `src/styles/index.css` - CSS global

### PWA
- [ ] `public/manifest.json` - PWA manifest
- [ ] `public/sw.js` - Service Worker

### Configuración
- [ ] `.gitignore` - Git ignore
- [ ] `.env.example` - Template env

---

## 📚 Verificación de documentación

- [ ] `README.md` - Guía principal
- [ ] `SETUP_SUPABASE.md` - Setup BD
- [ ] `DESARROLLO.md` - Arquitectura
- [ ] `INICIO_RAPIDO.md` - Quick start
- [ ] `EJEMPLOS.md` - Ejemplos código
- [ ] `BIENVENIDA.md` - Bienvenida
- [ ] `INDICE.md` - Índice
- [ ] `RESUMEN_FINAL.md` - Resumen
- [ ] `ESTRUCTURA.txt` - Estructura visual

---

## 🔧 Verificación de instalación

Ejecuta estos comandos en la terminal:

### Verificar Node.js
```bash
node --version
# Debe mostrar v18 o superior
```
- [ ] Node.js 18+

### Verificar npm
```bash
npm --version
# Debe mostrar 9 o superior
```
- [ ] npm 9+

### Instalar dependencias
```bash
cd "c:\Users\USUARIO\Documents\PASO A PASO - CREACION APP MERCADO\APP"
npm install
```
- [ ] npm install completó sin errores
- [ ] Carpeta `node_modules` creada
- [ ] `package-lock.json` creado

---

## 🔑 Verificación de Supabase

### Proyecto creado
- [ ] Cuenta en supabase.com
- [ ] Proyecto creado
- [ ] Base de datos lista

### Credenciales obtenidas
- [ ] Project URL copiado
- [ ] anon public key copiado

### .env.local configurado
```bash
# Archivo debe existir en la raíz del proyecto
cat .env.local
```
Debe mostrar:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
```
- [ ] Archivo `.env.local` creado
- [ ] VITE_SUPABASE_URL correcto
- [ ] VITE_SUPABASE_ANON_KEY correcto

### Tablas creadas
En Supabase SQL Editor, verificar que existen:
- [ ] Tabla `users`
- [ ] Tabla `products`
- [ ] Tabla `orders`
- [ ] RLS habilitado en todas

### Autenticación configurada
- [ ] Email provider activo
- [ ] (Opcional) Google provider configurado

---

## 🎬 Verificación de desarrollo

### Iniciar la app
```bash
npm run dev
```
- [ ] Comando ejecuta sin errores
- [ ] Mensaje "Local: http://localhost:3000"
- [ ] Navegador abre automáticamente

### Verificar funcionalidad
```
http://localhost:3000/
```
- [ ] Home carga correctamente
- [ ] Botones de Login/Register visibles
- [ ] Estilos Tailwind aplicados

### Verificar navegación sin auth
- [ ] Link "Regístrate" funciona
- [ ] Link "Inicia sesión" funciona
- [ ] Logo redirecciona a home

### Verificar registro
1. Click "Regístrate"
2. Seleccionar rol: "Consumidor"
3. Email: `test-consumer@example.com`
4. Password: `Test123!`
5. Click "Registrarse"
- [ ] Formulario valida campos
- [ ] No hay errores en consola
- [ ] Redirige a login

### Verificar login
1. Click "Inicia sesión"
2. Email: `test-consumer@example.com`
3. Password: `Test123!`
4. Click "Iniciar sesión"
- [ ] Login exitoso
- [ ] Redirige a home
- [ ] Usuario mostrado en Navbar

### Verificar catálogo
1. En home, click "Explorar productos"
2. O click "Catálogo" en Navbar
- [ ] Página carga sin errores
- [ ] Muestra campo de búsqueda
- [ ] Muestra dropdown de categorías
- [ ] Si no hay productos, muestra mensaje

### Verificar productor
1. Logout
2. Registrarse como productor
3. Email: `test-producer@example.com`
4. Rol: "Productor"
5. Click "Registrarse"
6. Login con este usuario
- [ ] Panel del productor funciona
- [ ] Botón "Nuevo producto" visible
- [ ] Click abre formulario

### Verificar crear producto
1. Como productor, click "Nuevo producto"
2. Llenar formulario:
   - Nombre: "Tomates"
   - Descripción: "Tomates frescos"
   - Precio: "5"
   - Cantidad: "10"
   - Categoría: "Vegetales"
3. Click "Publicar oferta"
- [ ] Formulario valida campos
- [ ] Click funciona
- [ ] Redirige a panel productor
- [ ] Producto aparece en lista

### Verificar catálogo con producto
1. Como consumidor, ir a catálogo
2. Buscar "Tomates"
- [ ] Producto aparece en catálogo
- [ ] Se ve la foto (si la hay)
- [ ] Se ve el precio
- [ ] Se ve la cantidad

### Verificar WhatsApp
1. En catálogo, click "Hacer pedido por WhatsApp"
- [ ] Se abre nueva ventana/tab
- [ ] URL contiene "wa.me"
- [ ] Mensaje está en la URL

---

## 🎨 Verificación de estilos

### Tailwind funciona
- [ ] Colores primarios aplicados
- [ ] Responsive en mobile
- [ ] Botones con estilos correctos
- [ ] Inputs con focus correcto

### Colores
- [ ] Verde primario (botones) ✓
- [ ] Ámbar secundario (compra) ✓
- [ ] Gris neutral ✓

---

## 🔨 Verificación de build

### Compilar
```bash
npm run build
```
- [ ] Comando completa sin errores
- [ ] Carpeta `dist` creada
- [ ] Archivos en `dist/index.html`, `dist/assets/`

### Preview
```bash
npm run preview
```
- [ ] App funciona en preview
- [ ] Todos los links funcionan

---

## 🛡️ Verificación de seguridad

### Variables de entorno
- [ ] `.env.local` NO está en git (.gitignore)
- [ ] `.env.example` SÍ está en git
- [ ] Credenciales no visibles en código

### No hay console errors
Abrir DevTools (F12) → Console
- [ ] No hay errores rojos
- [ ] Puede haber warnings (OK)

---

## 📱 Verificación de PWA

### Service Worker
En DevTools → Application:
- [ ] Service Worker registrado
- [ ] Manifest.json presente
- [ ] Cache storage funciona

### Instalable
- [ ] Icono de instalación aparece (Chrome)
- [ ] Se puede instalar como app

---

## ✨ Verificación final

Cuando TODO esté ✓:

```bash
# 1. App funciona en dev
npm run dev

# 2. Puedo registrarme
# 3. Puedo hacer login
# 4. Como productor, puedo crear producto
# 5. Como consumidor, veo el catálogo
# 6. Puedo hacer pedido por WhatsApp
# 7. App se instala como PWA
# 8. Funciona offline (última vista)
# 9. Build compila sin errores
# 10. Deploy a Vercel funciona
```

---

## 🎯 Checklist rápido (15 min)

1. [ ] `npm install` ✓
2. [ ] `.env.local` configurado ✓
3. [ ] Tablas en Supabase creadas ✓
4. [ ] `npm run dev` funciona ✓
5. [ ] Home carga ✓
6. [ ] Puedo registrarme ✓
7. [ ] Puedo hacer login ✓
8. [ ] Catálogo funciona ✓
9. [ ] Crear producto funciona ✓
10. [ ] WhatsApp abre ✓

**Si todo está ✓, ¡estás listo para desarrollar!**

---

## 🆘 Problemas comunes

| Problema | Solución |
|----------|----------|
| `Cannot find module` | `npm install` |
| Env no definido | Crea `.env.local` |
| CORS error | Config en Supabase Settings |
| BD vacía | Ejecuta SQL de SETUP_SUPABASE.md |
| Página blanca | Mira console (F12) |
| WhatsApp no abre | Revisa número de teléfono |
| Build falla | `npm run build` completo |

---

## 📞 Soporte

Si algo no funciona:

1. **Revisa console** (F12 → Console)
2. **Lee DESARROLLO.md** (arquitectura)
3. **Copia de EJEMPLOS.md** (código)
4. **Verifica .env.local** (credenciales)
5. **Revisa tablas en Supabase** (SQL)

---

**¡Verificación completa = Proyecto listo para producción!** ✅

Guarda este archivo y úsalo como referencia mientras desarrollas.
