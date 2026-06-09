# 🔐 ENTREGABLE 2: ACCESO AL SISTEMA
## Guía de Pruebas - Mercado Campesino Digital

---

## 🌐 ACCESO A LA APLICACIÓN

### URL de Pruebas (Desarrollo Local)

```
http://localhost:3000
```

**Requisitos previos:**
- Node.js 18+ instalado
- Git para clonar el repositorio
- npm o yarn para gestionar dependencias

---

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### Paso 1: Preparar el entorno

```bash
# 1. Navega a la carpeta del proyecto
cd "PASO A PASO - CREACION APP MERCADO/APP"

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

**Resultado esperado:** La aplicación abre automáticamente en http://localhost:3000

### Paso 2: Verificar conexión

Si no abre automáticamente:
1. Abre tu navegador manualmente
2. Ve a: `http://localhost:3000`
3. Deberías ver la página de inicio (Home)

---

## 👥 USUARIOS DE PRUEBA

### 1. CONSUMIDOR
```
📧 Email:    consumer@test.com
🔑 Password: Test123!
👤 Rol:      Consumidor
```

**Acceso rápido:**
1. Ve a http://localhost:3000/login
2. Copia el email y contraseña de arriba
3. Haz clic en "Iniciar sesión"
4. Serás redirigido automáticamente al catálogo

**Qué puedes hacer:**
- ✅ Ver catálogo completo de productos
- ✅ Buscar productos
- ✅ Filtrar por categoría
- ✅ Ver detalles de cada producto
- ✅ Hacer pedidos por WhatsApp

---

### 2. PRODUCTOR
```
📧 Email:    producer@test.com
🔑 Password: Test123!
👤 Rol:      Productor
```

**Acceso rápido:**
1. Ve a http://localhost:3000/login
2. Copia el email y contraseña de arriba
3. Haz clic en "Iniciar sesión"
4. Serás redirigido automáticamente al panel del productor

**Qué puedes hacer:**
- ✅ Ver tu perfil
- ✅ Editar tu información
- ✅ Registrar teléfono WhatsApp (si no lo hizo)
- ✅ Crear nuevos productos
- ✅ Ver tus productos publicados
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Recibir pedidos por WhatsApp

---

### 3. ADMINISTRADOR
```
📧 Email:    admin@test.com
🔑 Password: Test123!
👤 Rol:      Admin
```

**Acceso rápido:**
1. Ve a http://localhost:3000/register
2. Crea una cuenta nueva con estos datos (si no existe)
3. Selecciona "Admin" como rol
4. Haz clic en "Registrarse"
5. Serás redirigido al panel admin

**Qué puedes hacer:**
- ✅ Acceder al dashboard administrativo
- ✅ Ver información general del sistema
- ✅ Gestionar usuarios (fase futura)

---

## 🧪 FLUJO DE PRUEBA COMPLETO (15 MINUTOS)

### Escenario: Compra de tomates

#### PASO 1: Registrarse como Productor Nuevo (2 min)

1. Ve a http://localhost:3000/register
2. Selecciona **"Productor (Quiero vender)"**
3. Llena el formulario:
   ```
   Email: tomate@productor.com
   Password: Productor123!
   ```
4. Haz clic en **"Registrarse"**
5. Serás redirigido al panel del productor
6. Completa tu perfil en el modal que aparece:
   ```
   Nombre: Juan
   Apellido: García
   WhatsApp: +5730012345678
   ```
7. Haz clic en **"Guardar"**

#### PASO 2: Publicar un Producto (3 min)

1. Haz clic en **"Publicar nuevo producto"**
2. Llena el formulario:
   ```
   Nombre del Producto: Tomates Cherry Frescos
   Descripción: Tomates cherry cultivados sin químicos
   Precio: 45000 (por kg)
   Cantidad Disponible: 50 kg
   Categoría: Vegetales
   ```
3. Selecciona una imagen:
   - Clic en **"Seleccionar imagen"**
   - Elige una imagen de tomates (si tienes)
4. Haz clic en **"Publicar oferta"**
5. ✅ Verás tu producto en la lista

#### PASO 3: Registrarse como Consumidor (2 min)

1. **Abre una ventana privada** o **nueva pestaña del navegador**
2. Ve a http://localhost:3000/register
3. Selecciona **"Consumidor (Quiero comprar)"**
4. Llena el formulario:
   ```
   Email: cliente@ejemplo.com
   Password: Cliente123!
   ```
5. Haz clic en **"Registrarse"**
6. Serás redirigido automáticamente al **catálogo**

#### PASO 4: Buscar y Comprar (3 min)

1. Verás el **catálogo completo**
2. **Prueba la búsqueda**: 
   - En el campo de búsqueda escribe: "tomate"
   - Deberías ver el producto que publicaste
3. **Prueba el filtro**:
   - Selecciona "Vegetales" de la categoría
   - El producto sigue visible
4. Haz clic en el producto para ver detalles
5. **Haz clic en "Hacer pedido por WhatsApp"**
6. ✅ Se abrirá WhatsApp Web con un mensaje prefabricado

#### PASO 5: Confirmar el Pedido (3 min)

1. En WhatsApp verás un mensaje como:
   ```
   Hola, quiero pedir:
   
   Producto: Tomates Cherry Frescos
   Cantidad: 1 kg
   Precio unitario: $45.000
   Total: $45.000
   ```
2. El mensaje se envía al número del productor
3. El productor confirma por WhatsApp (fuera de la plataforma)
4. ✅ El pedido está completo

---

## 🗂 RUTAS DISPONIBLES

### Sin Autenticación
| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio (Home) |
| `/login` | Iniciar sesión |
| `/register` | Crear nueva cuenta |
| `/forgot-password` | Recuperar contraseña |
| `/reset-password` | Restablecer contraseña |

### Autenticado (Cualquier Usuario)
| Ruta | Descripción |
|------|-------------|
| `/catalog` | Catálogo de productos |

### Solo Productor
| Ruta | Descripción |
|------|-------------|
| `/producer` | Panel del productor |
| `/create-product` | Crear nuevo producto |

### Solo Admin
| Ruta | Descripción |
|------|-------------|
| `/admin` | Panel administrativo |

---

## 🔧 TROUBLESHOOTING

### Problema: "No carga la página"
**Solución:**
1. Verifica que el servidor está corriendo: `npm run dev`
2. Prueba http://localhost:3000 en el navegador
3. Limpia cache: Ctrl+Shift+Del → Cookies y datos

### Problema: "Error al registrarse"
**Solución:**
1. Verifica que el email no esté registrado ya
2. La contraseña debe tener al menos 8 caracteres
3. Revisa la consola (F12) para más detalles

### Problema: "WhatsApp no abre"
**Solución:**
1. El productor debe tener un número de WhatsApp registrado
2. Requiere conexión a internet
3. WhatsApp Web debe estar configurado en tu navegador

### Problema: "No veo productos en el catálogo"
**Solución:**
1. Verifica que existen productos publicados
2. Asegúrate de que la cantidad > 0
3. Limpia el cache del navegador

---

## 📱 PRUEBAS EN DIFERENTES DISPOSITIVOS

### Desktop (Chrome, Firefox, Safari, Edge)
✅ Completamente funcional

### Tablet
✅ Interfaz responsive funciona correctamente

### Mobile
✅ Interfaz optimizada para pantallas pequeñas

**Para probar en mobile:**
1. En Chrome: F12 → Click en icono de dispositivo
2. Selecciona un dispositivo móvil
3. Recarga la página

---

## 🎬 VIDEO DEMOSTRATIVO (Guión)

### Tomas recomendadas:

1. **Home (10 seg)**
   - Mostrar página principal
   - Características destacadas

2. **Registro Productor (20 seg)**
   - Ir a /register
   - Seleccionar rol productor
   - Llenar formulario
   - Completar perfil

3. **Crear Producto (30 seg)**
   - Click "Nuevo producto"
   - Llenar formulario
   - Subir imagen
   - Publicar

4. **Registro Consumidor (20 seg)**
   - Nueva ventana/tab
   - Ir a /register
   - Seleccionar rol consumidor
   - Llenar formulario

5. **Ver Catálogo (20 seg)**
   - Mostrar catálogo
   - Hacer búsqueda
   - Aplicar filtro
   - Ver detalles de producto

6. **Hacer Pedido (20 seg)**
   - Click en producto
   - Click "Hacer pedido"
   - Mostrar WhatsApp abierto
   - Mensaje prefabricado

**Duración total**: 2 minutos

---

## 🎯 CHECKLIST DE VERIFICACIÓN

- [ ] Servidor corriendo en puerto 3000
- [ ] Página home carga correctamente
- [ ] Registro de consumidor funciona
- [ ] Registro de productor funciona
- [ ] Login de ambos usuarios funciona
- [ ] Productor puede crear producto
- [ ] Producto aparece en catálogo
- [ ] Consumidor puede buscar producto
- [ ] Filtro de categoría funciona
- [ ] WhatsApp abre con mensaje correcto

---

## 📊 DATOS ESTADÍSTICOS

### Estado Actual de la Base de Datos

**Usuarios en el sistema:**
- Consumidores: 1+
- Productores: 1+
- Administradores: 1+

**Productos disponibles:**
- Total: 1+ (según lo que publiques)
- Por categoría: Variables

**Categorías activas:**
- Vegetales
- Frutas
- Lácteos
- Carnes
- Otros

---

## 💬 CONTACTO Y FEEDBACK

Para reportar problemas o sugerencias:
1. Revisa [TROUBLESHOOTING_FAQ.md](./TROUBLESHOOTING_FAQ.md)
2. Verifica [CHECKLIST_VERIFICACION.md](./CHECKLIST_VERIFICACION.md)
3. Abre la consola del navegador (F12) para ver logs

---

**Última actualización**: Junio 2026
**Versión MVP**: 1.0 Beta
