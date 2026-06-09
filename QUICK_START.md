# ⚡ QUICK START - GUÍA RÁPIDA (5 MINUTOS)

## 🎯 Objetivo
Hacer que un consumidor pueda hacer pedidos por WhatsApp a un productor

## ✅ Requisitos Previos

- [ ] Proyecto React corriendo en `localhost:3001`
- [ ] Supabase account creada
- [ ] Git y npm instalados
- [ ] WhatsApp Web o App disponible

---

## ⏱️ PASO 1: Setup Supabase (2 minutos)

### 1a. Ejecutar SQL
1. Ve a **Supabase Dashboard** → Tu proyecto → **SQL Editor**
2. Crea nueva query
3. Copia TODO de `SUPABASE_SETUP.sql`
4. Pega en el editor
5. Clic ▶️ **Run**
6. ✅ Espera ✓ verde

### 1b. Obtener claves
1. Ve a **Settings** (engranaje) → **API**
2. Copia:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
3. Pega en `.env.local` en tu proyecto

```env
VITE_SUPABASE_URL=https://tu-uuid.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

---

## ⏱️ PASO 2: Registrar Productor (1 minuto)

### 2a. Registro
1. Abre http://localhost:3001/register
2. Completa:
   ```
   Email: productor@test.com
   Password: Asd123456
   Rol: ●Productor
   ```
3. Clic **Registrarse**

### 2b. Perfil
1. Modal: Completa perfil
   ```
   Nombre: Juan
   Apellido: García
   WhatsApp: +573001234567
   ```
2. Clic **Guardar Perfil**

### 2c. Producto
1. Clic **Publicar nuevo producto**
2. Completa:
   ```
   Nombre: Tomates
   Precio: 2.50
   Cantidad: 50
   Categoría: Vegetales
   ```
3. Clic **📢 Publicar oferta**

---

## ⏱️ PASO 3: Registrar Consumidor (1 minuto)

### 3a. Logout (si es necesario)
1. Clic arriba derecha → **Cerrar sesión**

### 3b. Nuevo registro
1. Ve a /register
2. Completa:
   ```
   Email: consumidor@test.com
   Password: Asd123456
   Rol: ●Consumidor
   ```
3. Clic **Registrarse**
4. Se abre automáticamente `/catalog`

---

## ⏱️ PASO 4: Hacer Pedido (1 minuto)

### 4a. Ver producto
1. Deberías ver: **Tomates - $2.50**
2. Verifica que sea el producto del productor

### 4b. Clic en pedir
1. Clic **📱 Hacer pedido por WhatsApp**
2. ✅ Se abre WhatsApp

### 4c. Verificar mensaje
Deberías ver:
```
Hola, quiero pedir:

Producto: Tomates
Cantidad: 1
Precio unitario: $2.50
Total: $2.50
```

Dirigido a: **+573001234567**

---

## 🔍 Verificar en Supabase

### Check 1: Usuarios creados
```
Supabase → Table Editor → users
```

| email | first_name | phone |
|---|---|---|
| productor@test.com | Juan | +573001234567 |
| consumidor@test.com | null | null |

### Check 2: Productos
```
Supabase → Table Editor → products
```

| name | price | quantity | producer_id |
|---|---|---|---|
| Tomates | 2.50 | 50 | [ID Juan] |

---

## 🎯 Código Clave

### Cómo se obtiene el teléfono (`Catalog.jsx`):

```javascript
// 1. Carga productos
const { products, fetchProducts } = useProductStore()

// 2. Para cada producto, obtiene phone del productor
const { data } = await supabase
  .from('users')
  .select('id, phone')
  .in('id', producerIds)

// 3. Mapea: producerPhones[producerId] = phone
producerPhones = { 'uuid-juan': '+573001234567' }

// 4. Al hacer click, obtiene el phone
const producerPhone = producerPhones[product.producer_id]

// 5. Abre WhatsApp
openWhatsApp(producerPhone, orderData)
```

---

## 📱 Copiar Números de Test

| País | Número |
|---|---|
| Colombia | +573001234567 |
| México | +525512345678 |
| España | +34612345678 |
| USA | +17025551234 |

O usa **TU número real** para pruebas.

---

## 🆘 Si No Funciona

### ❌ "No hay productos"
- ✅ Verifica que completes perfil del productor
- ✅ Verifica en Supabase → products que existe

### ❌ "No abre WhatsApp"
- ✅ Abre https://web.whatsapp.com
- ✅ O instala WhatsApp Desktop
- ✅ Luego intenta de nuevo

### ❌ "Error al guardar perfil"
- ✅ Número debe ser: +573001234567
- ✅ Revisa consola (F12) para ver error

### ❌ "Otros errores"
- ✅ Recarga: Ctrl+Shift+R
- ✅ Reinicia: `npm run dev`
- ✅ Revisa `TROUBLESHOOTING_FAQ.md`

---

## ✨ Funcionalidades Completadas

✅ Productor ingresa teléfono al completar perfil  
✅ Teléfono se guarda en Supabase tabla `users`  
✅ Consumidor ve catálogo con productos del productor  
✅ Al hacer pedido, se obtiene teléfono del productor  
✅ Se abre WhatsApp con mensaje automático  
✅ El mensaje incluye: producto, cantidad, precio  
✅ El destinatario es el teléfono del productor  

---

## 🎓 Flujo Resumido

```
PRODUCTOR                    CONSUMIDOR
    ↓                            ↓
Registra con rol           Registra con rol
    ↓                            ↓
Completa perfil            Ve catálogo
(nombre, apellido, phone)        ↓
    ↓                       Ve producto
Publica producto                ↓
    ↓                       Hace clic "Pedir"
Se guarda en DB                 ↓
    ↓                    Se obtiene phone del productor
    ├──────────────────────────►│
                                ↓
                         Se abre WhatsApp
                                ↓
                         Mensaje automático
                                ↓
                         ¡Productor recibe!
```

---

## 🚀 Próximos Pasos (Opcionales)

1. **Tabla de Órdenes**: Guardar pedidos en DB
2. **Notificaciones**: Alertar al productor
3. **Admin Panel**: Ver todas las órdenes
4. **Calificaciones**: Consumidor valora productor
5. **Mensajes**: Chat en la app

---

## 📋 Checklist Final

- [ ] SQL ejecutado en Supabase
- [ ] .env.local configurado
- [ ] Productor registrado con teléfono
- [ ] Producto publicado
- [ ] Consumidor registrado
- [ ] Producto visible en catálogo
- [ ] WhatsApp abierto al hacer clic
- [ ] Mensaje tiene datos correctos

✅ **¡LISTO! Tu app funciona! 🎉**

---

## 📞 Documentación Completa

Lee estos para más detalles:

1. **GUIA_IMPLEMENTACION_WHATSAPP.md** - Setup paso a paso
2. **RESUMEN_TECNICO_FINAL.md** - Cómo funciona el sistema
3. **DISENO_BASE_DATOS.md** - Estructura de Supabase
4. **TROUBLESHOOTING_FAQ.md** - Solución de problemas

---

**¿Preguntas? Revisa la documentación o abre un issue en GitHub.**
