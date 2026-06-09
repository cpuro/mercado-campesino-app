# 🚀 INSTRUCCIONES PASO A PASO - IMPLEMENTAR SISTEMA DE PEDIDOS POR WHATSAPP

## Fase 1: Configurar Supabase ✅

### Paso 1.1: Ejecutar SQL en Supabase
1. Abre tu proyecto en Supabase → **SQL Editor**
2. Crea una nueva query
3. Copia TODO el contenido de `SUPABASE_SETUP.sql`
4. Pégalo en el SQL Editor
5. Haz clic en ▶️ **Run**
6. Espera a que termine (verás un ✅ verde)

### Paso 1.2: Verificar tablas
1. Ve a **Table Editor** en Supabase
2. Deberías ver 3 tablas nuevas:
   - `users`
   - `products`
   - `orders`

---

## Fase 2: Configurar Variables de Entorno ✅

### Paso 2.1: Crear archivo .env.local
1. En la raíz de tu proyecto (APP), crea un archivo llamado `.env.local`
2. Agrega estas líneas:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### Paso 2.2: Obtener tus claves
1. Ve a Supabase → **Settings** (engranaje abajo a la izquierda)
2. Ve a **API**
3. Copia:
   - `Project URL` → pégalo en `VITE_SUPABASE_URL`
   - `anon public` key → pégalo en `VITE_SUPABASE_ANON_KEY`
4. Guarda `.env.local`

### Paso 2.3: Reiniciar servidor
1. En terminal: `npm run dev`
2. Recarga el navegador (Ctrl+Shift+R para limpiar caché)

---

## Fase 3: Probar el Flujo Completo ✅

### Paso 3.1: Registrar un Productor
1. Abre http://localhost:3001/register
2. Completa:
   - Email: `productor@ejemplo.com`
   - Contraseña: `Senha123!`
   - Selecciona: **Productor** ← IMPORTANTE
3. Haz clic en **Registrarse**
4. Deberías ser redirigido a `/producer`

### Paso 3.2: Completar Perfil del Productor
1. En el panel del productor, verás:
   - Banner amarillo: "⚠️ Completa tu perfil para poder publicar"
   - Botón: "Completar Perfil"
2. Haz clic en el botón
3. En el modal, ingresa:
   - Nombre: `Juan`
   - Apellido: `García`
   - WhatsApp: `+573001234567` (tu número real o uno de prueba)
4. Haz clic en **Guardar Perfil**
5. Verás: "✓ Perfil completado"

### Paso 3.3: Publicar un Producto
1. Haz clic en **Publicar nuevo producto**
2. Completa el formulario:
   - Nombre: `Tomates frescos`
   - Categoría: `Vegetales`
   - Descripción: `Tomates de la mejor calidad`
   - Precio: `2.50`
   - Cantidad: `50`
   - URL de imagen: `https://via.placeholder.com/200`
3. Haz clic en **📢 Publicar oferta**
4. Deberías volver al panel y ver tu producto

### Paso 3.4: Ver en Catálogo
1. Haz clic en **Catálogo** (arriba a la derecha)
2. O ve a http://localhost:3001/catalog
3. Deberías ver tu producto con:
   - Imagen
   - Nombre: "Tomates frescos"
   - Precio: "$2.50"
   - Disponible: "50"
   - Botón: "📱 Hacer pedido por WhatsApp"

### Paso 3.5: Probar Pedido por WhatsApp
1. Haz clic en **"📱 Hacer pedido por WhatsApp"**
2. Se abrirá WhatsApp Web (o la app en móvil)
3. Verás el mensaje automático:
   ```
   Hola, quiero pedir:
   
   Producto: Tomates frescos
   Cantidad: 1
   Precio unitario: $2.50
   Total: $2.50
   ```
4. El mensaje está dirigido a tu número (+573001234567)
5. ¡Puedes responder como cliente!

---

## Fase 4: Probar con Consumidor ✅

### Paso 4.1: Registrar un Consumidor
1. Ve a http://localhost:3001/register
2. Completa:
   - Email: `cliente@ejemplo.com`
   - Contraseña: `Senha123!`
   - Selecciona: **Consumidor** ← IMPORTANTE
3. Haz clic en **Registrarse**
4. Deberías ser redirigido a `/catalog`

### Paso 4.2: Ver Productos
1. Deberías ver el producto que publicaste como productor
2. Prueba la búsqueda: escribe "tomates"
3. Prueba el filtro: selecciona "Vegetales"

### Paso 4.3: Hacer Pedido
1. Haz clic en **"📱 Hacer pedido por WhatsApp"**
2. Se abrirá con el número del productor
3. ¡El flujo completo funciona!

---

## Fase 5: Verificar Base de Datos ✅

### Paso 5.1: Ver usuarios creados
1. Ve a Supabase → **Table Editor**
2. Abre tabla `users`
3. Deberías ver 2 registros:
   - Email: `productor@ejemplo.com`, role: `producer`, phone: `+573001234567`
   - Email: `cliente@ejemplo.com`, role: `consumer`, phone: NULL

### Paso 5.2: Ver productos creados
1. Abre tabla `products`
2. Deberías ver 1 registro:
   - producer_id: (ID del productor)
   - name: `Tomates frescos`
   - price: `2.50`
   - quantity: `50`

---

## ⚠️ Solución de Problemas

### Problema: "No hay productos en el catálogo"
- ✅ Verifica que completaste el perfil del productor
- ✅ Verifica que la cantidad sea > 0
- ✅ Abre la consola (F12) y busca errores

### Problema: "No se carga el número de WhatsApp"
- ✅ Verifica en Supabase que la columna `phone` tenga datos
- ✅ En el navegador (F12), ve a Network y busca errores en la request a `/users`

### Problema: "Error al guardar perfil"
- ✅ Verifica que el número empiece con `+` (ej: +57...)
- ✅ Verifica que tengas 10-15 dígitos después del +
- ✅ No uses espacios, guiones o paréntesis

### Problema: "El navegador no abre WhatsApp"
- ✅ Verifica que tengas WhatsApp Web abierto (web.whatsapp.com)
- ✅ O que tengas WhatsApp en tu teléfono instalado
- ✅ El número debe estar en formato internacional

### Problema: "Error en consola: 'phone is required'"
- ✅ Completa el perfil del productor correctamente
- ✅ El perfil no se guardó en la primera vez, intenta de nuevo

---

## 🔄 Flujo Visual

```
┌─────────────────────────────────────────┐
│        PANTALLA DE REGISTRO             │
│  ┌──────────────────────────────────┐   │
│  │ Email: productor@ejemplo.com     │   │
│  │ Password: ****                   │   │
│  │ [Productor] ← Selecciona esto    │   │
│  │ [Registrarse]                    │   │
│  └──────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
    ✅ Crear en auth.users
    ✅ Crear en tabla users (con rol)
                 ↓
┌─────────────────────────────────────────┐
│        PANEL DEL PRODUCTOR              │
│ ⚠️ Completa tu perfil para publicar     │
│ ┌──────────────────────────────────┐    │
│ │ [Completar Perfil]               │    │
│ └──────────────────────────────────┘    │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│        MODAL: FORMULARIO DE PERFIL      │
│ Nombre: [Juan_________]                 │
│ Apellido: [García_____]                 │
│ WhatsApp: [+573001234567____]           │
│ [Guardar]                               │
└────────────────┬────────────────────────┘
                 ↓
    ✅ Actualizar tabla users
                 ↓
┌─────────────────────────────────────────┐
│        PANEL DEL PRODUCTOR              │
│ ✓ Perfil completado                     │
│ [Publicar nuevo producto]               │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│      FORMULARIO: CREAR PRODUCTO         │
│ Nombre: [Tomates frescos____]           │
│ Precio: [2.50__]                        │
│ Cantidad: [50__]                        │
│ [📢 Publicar oferta]                    │
└────────────────┬────────────────────────┘
                 ↓
    ✅ Crear en tabla products
    ✅ producer_id = ID del productor
                 ↓
         [CONSUMIDOR]
              ↓
   Accede a /catalog
              ↓
   Ve: Tomates - $2.50
   [📱 Hacer pedido por WhatsApp]
              ↓
   Se carga el phone del productor
              ↓
   wa.me/+573001234567?text=[mensaje]
              ↓
   ✅ ¡WhatsApp abierto!
```

---

## ✨ Características Habilitadas

| Característica | Cómo probar |
|---|---|
| Registro con rol | Registrarse como Productor/Consumidor |
| Perfil del productor | Completar en modal |
| Validación de WhatsApp | Intentar con número inválido (falla) |
| Publicar producto | Click en "Publicar nuevo producto" |
| Ver catálogo | Ir a /catalog |
| Buscar productos | Escribir en "Buscar productos..." |
| Filtrar por categoría | Seleccionar en dropdown |
| Pedidos por WhatsApp | Click en "📱 Hacer pedido por WhatsApp" |

---

## 📱 Ejemplo de Números para Prueba

Usa estos números para pruebas locales:

| País | Código | Ejemplo |
|---|---|---|
| Colombia | +57 | +573001234567 |
| México | +52 | +525512345678 |
| España | +34 | +34612345678 |
| Argentina | +54 | +541123456789 |
| Estados Unidos | +1 | +17025551234 |

O usa tu número real para probar en tu WhatsApp.

---

## 🎯 Próximos Pasos (Opcionales)

### 1. Agregar Tabla de Órdenes
- [ ] Guardar órdenes cuando se hace click en "Pedir"
- [ ] Ver historial de órdenes en productor/consumidor

### 2. Notificaciones
- [ ] Notificar al productor cuando recibe un pedido
- [ ] Enviar confirmación al consumidor

### 3. Editar Perfil
- [ ] Permitir cambiar nombre/teléfono después
- [ ] Historial de cambios

### 4. Validación Avanzada
- [ ] Verificar teléfono con SMS
- [ ] Validación según país

### 5. Admin Panel
- [ ] Ver todas las órdenes
- [ ] Estadísticas de vendedores
- [ ] Moderar contenido

---

## 🆘 ¿Necesitas ayuda?

Si algo no funciona:
1. Abre la consola (F12) y mira los errores
2. Verifica que .env.local tenga las claves correctas
3. Reinicia el servidor: `npm run dev`
4. Recarga la página: Ctrl+Shift+R
5. Verifica en Supabase que las tablas existan

¡Listo! Tu aplicación está completa y funcionando. 🎉
