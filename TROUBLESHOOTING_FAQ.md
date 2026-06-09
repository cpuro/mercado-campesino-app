# 🔧 TROUBLESHOOTING Y FAQ

## ❓ Preguntas Frecuentes

### P1: ¿Por qué no se guarda el teléfono del productor?

**R:** Verifica estos puntos:

1. ✅ **¿Has ejecutado el SQL?**
   - Ve a Supabase → SQL Editor
   - Pega el contenido de `SUPABASE_SETUP.sql`
   - Ejecuta (botón ▶️)

2. ✅ **¿El número tiene formato correcto?**
   ```
   ✅ +573001234567  (correcto)
   ❌ 3001234567     (falta +)
   ❌ +57 300 123 4567 (espacios no permitidos)
   ❌ (300) 123-4567 (caracteres especiales)
   ```

3. ✅ **¿Tiene 10-15 dígitos después del +?**
   ```
   ✅ +573001234567  (13 dígitos)
   ✅ +14155552671   (11 dígitos)
   ❌ +5730           (muy corto)
   ```

4. ✅ **¿Estás guardando en la tabla correcta?**
   - La tabla debe ser `users`, no `auth.users`
   - En Supabase → Table Editor → `users` → Verifica que haya datos

---

### P2: ¿Por qué no aparecen números en el catálogo?

**R:** El catálogo no carga números de productores si:

1. ❌ **No hay productos en la tabla `products`**
   - Verifica en Supabase que al menos 1 producto exista
   - Crea un producto como productor en la app

2. ❌ **Los productores no tienen teléfono en tabla `users`**
   - Ve a `Supabase → Table Editor → users`
   - Columna `phone` debe tener datos (no NULL/vacío)
   - Edita manualmente si es necesario:
     ```
     id: [uuid-productor]
     phone: +573001234567
     ```

3. ❌ **Hay un error en la query**
   - Abre consola (F12) en navegador
   - Ve a tab "Network"
   - Busca request a `/users`
   - Si falla, mira el error en "Response"

4. ✅ **Solución manual:**
   ```sql
   UPDATE users 
   SET phone = '+573001234567' 
   WHERE email = 'productor@ejemplo.com'
   ```

---

### P3: ¿Por qué WhatsApp no abre?

**R:** Causas comunes:

1. ❌ **No tienes WhatsApp instalado**
   - Abre web.whatsapp.com en tu navegador
   - O instala la app de escritorio

2. ❌ **El número no existe o está inactivo**
   - El número debe tener WhatsApp activo
   - Prueba escribiendo el número en web.whatsapp.com manualmente

3. ❌ **El navegador bloquea popups**
   - Abre Configuración → Privacidad → Popups
   - Permite localhost:3001
   - O usa otra pestaña manualmente

4. ✅ **Solución:**
   - Abre http://web.whatsapp.com
   - Escanea código QR con tu teléfono
   - Luego intenta el pedido de nuevo

---

### P4: ¿Por qué falla el registro?

**R:** Errores comunes de registro:

1. ❌ **Email ya registrado**
   ```
   Error: "User already registered"
   Solución: Usa otro email o crea una nueva cuenta en Supabase
   ```

2. ❌ **Contraseña muy débil**
   ```
   Requisitos: Mínimo 6 caracteres, mayúscula, número
   ❌ 12345678
   ❌ abcdefgh
   ✅ Abcdef123
   ```

3. ❌ **Email inválido**
   ```
   ❌ prueba@        (falta dominio)
   ❌ prueba@.com    (falta host)
   ✅ prueba@ejemplo.com
   ```

4. ✅ **Verificar en Supabase:**
   - Ve a Supabase → Authentication
   - Mira la lista de usuarios
   - Si tu email está ahí, el registro funcionó

---

### P5: ¿Por qué la app dice "Completa tu perfil"?

**R:** Es normal si:

1. ✅ **Acabas de registrarte**
   - Es un paso obligatorio
   - Completa: Nombre, Apellido, WhatsApp
   - Haz clic en "Guardar Perfil"

2. ❌ **La información no se guardó**
   - Intenta de nuevo
   - Verifica en consola (F12) que no haya errores

3. ❌ **Estás en rol consumidor**
   - Solo productores necesitan perfil completo
   - Si eres consumidor, ignora este mensaje

---

### P6: ¿Cómo agrego más productores?

**R:** Pasos:

1. Abre http://localhost:3001/register (o tu URL)
2. Ingresa:
   ```
   Email: nuevo_productor@ejemplo.com
   Password: Contraseña123
   Rol: Productor
   ```
3. Haz clic en **Registrarse**
4. Se abrirá automáticamente el modal de perfil
5. Ingresa: Nombre, Apellido, WhatsApp
6. Haz clic en **Guardar Perfil**
7. Ahora puede publicar productos

---

### P7: ¿Cómo veo los datos en Supabase?

**R:** Pasos:

1. Abre https://app.supabase.com/
2. Selecciona tu proyecto
3. Ve a **Table Editor** (en menú lateral)
4. Haz clic en tabla:
   - `auth.users` → Usuarios registrados
   - `users` → Perfil con teléfono
   - `products` → Productos publicados
5. Puedes:
   - Ver datos (preview)
   - Editar (clic en celda)
   - Agregar (botón +)
   - Eliminar (menú ...)

---

## 🐛 Bugs Conocidos

### Bug 1: "RLS policy violation"
**Síntoma:** Error al guardar perfil
**Causa:** RLS policy no está configurado correctamente
**Solución:**
```sql
-- En Supabase SQL Editor, ejecuta:
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Bug 2: "Table does not exist"
**Síntoma:** "Relation 'public.users' does not exist"
**Causa:** SQL setup no fue ejecutado
**Solución:**
1. Ejecuta `SUPABASE_SETUP.sql` completo
2. Espera a que termine (verás ✅)
3. Recarga la app

### Bug 3: "La cantidad siempre aparece como 0"
**Síntoma:** Aunque ingreses 50, aparece 0
**Causa:** Campo no se convierte a número
**Solución:** En `CreateProduct.jsx`, verifica:
```javascript
quantity: parseInt(formData.quantity)  // ← Debe ser parseInt
```

### Bug 4: "El perfil modal aparece cada vez"
**Síntoma:** Aunque guardes, sigue apareciendo
**Causa:** No se guardó en DB o no se carga al montar
**Solución:** Verifica:
```javascript
// Debe ejecutarse al montar el componente
useEffect(() => {
  loadProducerProfile()
}, [])
```

---

## ⚠️ Mensajes de Error Comunes

### Error 1: "Email or password is invalid"
```
Causa: Email no existe o contraseña incorrecta
Solución: Usa email registrado, contraseña correcta
```

### Error 2: "Row size exceeds PostgreSQL limit"
```
Causa: Una columna tiene demasiados datos
Solución: Verifica que image_url no sea enorme
```

### Error 3: "Invalid input syntax for UUID"
```
Causa: producer_id no es UUID válido
Solución: Verifica que el user.id sea UUID
```

### Error 4: "Phone must be in international format"
```
Causa: Teléfono no tiene formato +[código][número]
Solución: Ingresa: +573001234567
```

### Error 5: "CORS error when fetching"
```
Causa: Supabase CORS policy
Solución: Verifica que .env.local tenga URL correcta
```

---

## 🔍 Cómo Debuggear

### Paso 1: Abrir Consola (F12)
```
Navegador → F12 → Console
Busca mensajes de error en rojo
```

### Paso 2: Verificar Network
```
F12 → Network → Filtra por "Fetch/XHR"
Busca requests fallidas (rojo)
Haz clic para ver detalles
```

### Paso 3: Verificar Storage
```
F12 → Application → Local Storage
Busca clave "auth" o "state"
Verifica que tenga user.id, user.email, role
```

### Paso 4: Verificar Base de Datos
```
Supabase → Table Editor → users
Verifica que:
- Tu email esté ahí
- first_name, last_name no sean NULL
- phone tenga formato +...
```

### Paso 5: Logs en Server
```
En terminal donde corre "npm run dev"
Busca mensajes de error durante requests
Si no ves nada, reinicia: npm run dev
```

---

## 🧪 Checklist de Troubleshooting

### Antes de llamar a soporte:

- [ ] ¿Ejecutaste `SUPABASE_SETUP.sql`?
- [ ] ¿Tienes `.env.local` con claves Supabase?
- [ ] ¿Reiniciaste el servidor (`npm run dev`)?
- [ ] ¿Limpiaste caché (Ctrl+Shift+R)?
- [ ] ¿Recargaste la página después de editar?
- [ ] ¿Verificaste en Supabase que los datos existan?
- [ ] ¿Abriste la consola (F12) y viste errores?
- [ ] ¿El email está confirmado en Supabase?
- [ ] ¿Usas WhatsApp Web o App instalada?

Si respondiste "NO" a alguno, hazlo primero antes de continuar.

---

## 📱 Test Manual

### Test 1: ¿Se registra el usuario?
```
1. Ve a /register
2. Ingresa: test@ejemplo.com / Asd123456 / Productor
3. Hace clic "Registrarse"
4. Verifica en Supabase → auth.users → existe el usuario
```

### Test 2: ¿Se crea el perfil?
```
1. Completa el perfil en el modal
2. Ingresa: Juan / García / +573001234567
3. Hace clic "Guardar"
4. Verifica en Supabase → users → existe y phone no es NULL
```

### Test 3: ¿Se publica el producto?
```
1. Hace clic "Publicar nuevo producto"
2. Ingresa: Tomates / 2.50 / 50 / vegetales
3. Hace clic "Publicar"
4. Verifica en Supabase → products → existe el producto
```

### Test 4: ¿Se carga el teléfono en catálogo?
```
1. Registra consumidor
2. Va a /catalog
3. Ve el producto publicado
4. Abre consola (F12)
5. Ve que la query a users devolvió datos
6. Verifica que producerPhones tenga datos
```

### Test 5: ¿Se abre WhatsApp?
```
1. En catálogo, hace clic "Hacer pedido"
2. Se abre WhatsApp Web o App
3. El mensaje tiene: producto, cantidad, precio
4. El destinatario es el número del productor
```

---

## 💡 Tips Útiles

### Tip 1: Crear datos de prueba rápidamente
```sql
-- En Supabase SQL Editor
INSERT INTO users (id, email, first_name, last_name, phone, role)
VALUES (
  gen_random_uuid(),
  'prueba@ejemplo.com',
  'Juan',
  'García',
  '+573001234567',
  'producer'
)
```

### Tip 2: Ver todos los productores
```sql
SELECT first_name, last_name, phone FROM users WHERE role = 'producer'
```

### Tip 3: Restablecer contraseña
```
En Supabase → Authentication → selecciona usuario → menú ... → Reset password
Se envía email al usuario
```

### Tip 4: Borrar todo y empezar de nuevo
```sql
-- ⚠️ CUIDADO: Esto borra datos
DELETE FROM orders CASCADE;
DELETE FROM products CASCADE;
DELETE FROM users CASCADE;
-- Los usuarios en auth.users se borran automáticamente (cascade)
```

### Tip 5: Ver cuántos usuarios hay
```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
SELECT role, COUNT(*) FROM users GROUP BY role;
```

---

## 📞 Escalar a Soporte

Si después de todo esto aún no funciona, incluye:

1. ✅ Captura de pantalla del error
2. ✅ Contenido de consola (F12 → Console)
3. ✅ Contenido de .env.local (sin revelar claves completas)
4. ✅ Pasos que hiciste para reproducir
5. ✅ Resultado de SQL: `SELECT * FROM users LIMIT 1;`
6. ✅ Tu navegador y sistema operativo

Con esto podemos resolver cualquier problema rápidamente.

---

## 🎓 Aprender Más

### Documentación oficial:
- **Supabase:** https://supabase.com/docs
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **WhatsApp Web API:** https://www.whatsapp.com/business/api

### Videos útiles:
- Supabase Setup: YouTube "Supabase Tutorial"
- React Hooks: YouTube "React Hooks Full Course"
- WhatsApp Integration: YouTube "WhatsApp Web Integration"

---

✅ **¿Más preguntas? Revisa primero este documento.**
