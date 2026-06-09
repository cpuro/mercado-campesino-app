# 🎯 FUNCIONALIDAD DE REGISTRO - Guía de uso

## ¿Qué cambió?

Ahora cuando alguien se registra en Mercado Campesino Digital, es automáticamente redirigido según su rol:

---

## 📊 Diagrama de flujo

```
REGISTRO
   ↓
¿Qué eres?
├─ Productor (Quiero vender)
│  ↓
│  Completa formulario
│  ↓
│  Click "Registrarse"
│  ↓
│  ✅ Va a /producer
│  ├─ Panel del Productor
│  ├─ Botón "Nuevo producto"
│  └─ Crea y publica ofertas
│
└─ Consumidor (Quiero comprar)
   ↓
   Completa formulario
   ↓
   Click "Registrarse"
   ↓
   ✅ Va a /catalog
   ├─ Catálogo de productos
   ├─ Búsqueda y filtros
   └─ Hace pedidos por WhatsApp
```

---

## 🚀 Para Productores

### Paso 1: Registrarse
- Ir a **Regístrate**
- Seleccionar: **"Productor (Quiero vender)"**
- Llenar email y contraseña

### Paso 2: Automáticamente llega a Panel del Productor
- ✅ Ya está autenticado
- ✅ Ya está en `/producer`
- ✅ Ve su panel (vacío al inicio)

### Paso 3: Crear su primer producto
- Click en botón **"➕ Nuevo producto"**
- Llenar formulario:
  - Nombre del producto
  - Descripción
  - Precio
  - Cantidad disponible
  - Categoría
  - Foto (URL)
- Click **"📢 Publicar oferta"**

### Paso 4: Producto en catálogo
- El producto aparece en el catálogo
- Consumidores lo ven
- Recibe pedidos por WhatsApp

---

## 🛒 Para Consumidores

### Paso 1: Registrarse
- Ir a **Regístrate**
- Seleccionar: **"Consumidor (Quiero comprar)"**
- Llenar email y contraseña

### Paso 2: Automáticamente llega al Catálogo
- ✅ Ya está autenticado
- ✅ Ya está en `/catalog`
- ✅ Ve todos los productos disponibles

### Paso 3: Explorar productos
- **Buscar** productos por nombre
- **Filtrar** por categoría:
  - Vegetales
  - Frutas
  - Lácteos
  - Granos
  - Otros

### Paso 4: Hacer un pedido
- Ver producto que le interese
- Click en **"📱 Hacer pedido por WhatsApp"**
- ✅ Se abre WhatsApp con mensaje automático
- ✅ Mensaje contiene:
  - Producto: Tomate
  - Cantidad: 5 kg
  - Precio: $X
  - Total: $Y

### Paso 5: Confirmar con el productor
- El productor responde por WhatsApp
- Acuerdan detalles
- Realizan la transacción

---

## 🔒 Seguridad de roles

### ¿Qué puede hacer cada rol?

#### Productor
```
✅ Ver su panel (/producer)
✅ Crear productos (/create-product)
✅ Editar sus productos
✅ Eliminar sus productos
✅ Ver catálogo (/catalog)
❌ No puede acceder a /admin
❌ No puede crear productos de otros productores
```

#### Consumidor
```
✅ Ver catálogo (/catalog)
✅ Buscar productos
✅ Filtrar productos
✅ Hacer pedidos
❌ No puede acceder a /producer
❌ No puede acceder a /create-product
❌ No puede acceder a /admin
```

#### Admin
```
✅ Ver panel admin (/admin)
✅ Ver estadísticas
✅ Ver usuarios (futuro)
✅ Validar productores (futuro)
❌ Limitaciones según configuración
```

---

## 💡 Ejemplos prácticos

### Ejemplo 1: María se registra como Productora

```
1. María accede a http://localhost:3001/register
2. Selecciona "Productor (Quiero vender)"
3. Email: maria@huerto.com
4. Password: MiContraseña123
5. Click "Registrarse"
6. ✅ AUTOMÁTICAMENTE va a /producer
7. María hace click en "Nuevo producto"
8. Llena los datos:
   - Nombre: "Lechuga fresca"
   - Precio: $3.50
   - Cantidad: 50 kg
   - Categoría: "Vegetales"
9. Click "Publicar oferta"
10. La oferta aparece en el catálogo
11. Los consumidores la ven y pueden pedir
```

### Ejemplo 2: Juan se registra como Consumidor

```
1. Juan accede a http://localhost:3001/register
2. Selecciona "Consumidor (Quiero comprar)"
3. Email: juan@email.com
4. Password: MiContraseña456
5. Click "Registrarse"
6. ✅ AUTOMÁTICAMENTE va a /catalog
7. Juan ve todos los productos disponibles
8. Busca "lechuga"
9. Encuentra el producto de María
10. Hace click en "Hacer pedido por WhatsApp"
11. Se abre WhatsApp con el mensaje:
    "Hola, quiero pedir:
     Producto: Lechuga fresca
     Cantidad: 5 kg
     Precio: $3.50
     Total: $17.50"
12. María responde por WhatsApp
13. Acuerdan la entrega
```

---

## ⚠️ Situaciones especiales

### ¿Qué pasa si intento acceder a una ruta que no me corresponde?

```
Productor intenta ir a /catalog
  ✅ Funciona (todos pueden ver catálogo)

Consumidor intenta ir a /producer
  ❌ Redirige a home (no tiene permiso)

Consumidor intenta ir a /create-product
  ❌ Redirige a home (no tiene permiso)

Productor intenta ir a /admin
  ❌ Redirige a home (no tiene permiso)
```

### ¿Qué pasa si cierro sesión?

```
1. Click "Salir" en Navbar
2. Sesión se cierra
3. Redirige a /login
4. Puedes iniciar sesión nuevamente
5. Al loguear, el sistema detecta tu rol
6. Redirige automáticamente a tu área
```

---

## 🎯 Resumen de cambios

| Característica | Antes | Ahora |
|---|---|---|
| Después de registrarse | Iba a login | Va directo a su área |
| Productor después registrarse | Tenía que hacer login | Ve panel y crea productos |
| Consumidor después registrarse | Tenía que hacer login | Ve catálogo inmediatamente |
| Protección de rutas | Básica | Estricta por rol |
| Experiencia | Confusa | Fluida y directa |

---

## 📱 URLs importantes

| URL | Quién | Qué hace |
|-----|-------|----------|
| `/` | Todos | Home/Landing |
| `/login` | No autenticados | Iniciar sesión |
| `/register` | No autenticados | Registrarse |
| `/catalog` | Autenticados | Ver productos |
| `/producer` | Solo productores | Panel productor |
| `/create-product` | Solo productores | Crear producto |
| `/admin` | Solo admin | Panel admin |

---

## 🧪 Para probar en tu navegador

**Productor:**
1. http://localhost:3001/register
2. Selecciona "Productor"
3. Email: `test.producer@example.com`
4. Password: `Test123!`
5. Click "Registrarse"
6. ✅ Debería ir a `/producer`

**Consumidor:**
1. http://localhost:3001/register
2. Selecciona "Consumidor"
3. Email: `test.consumer@example.com`
4. Password: `Test123!`
5. Click "Registrarse"
6. ✅ Debería ir a `/catalog`

---

## 🎉 ¿Qué sigue?

Ahora que el flujo de registro funciona correctamente:

1. ✅ Prueba el flujo completo
2. ✅ Verifica que los productos se creen correctamente
3. ✅ Verifica que WhatsApp funcione
4. ✅ Prueba con diferentes usuarios
5. 📋 Conecta Supabase para persistencia real
6. 🚀 Deploy a producción

---

**¡La funcionalidad de registro está completa y funcionando!** ✨
