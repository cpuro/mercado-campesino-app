# 🔐 RECUPERACIÓN DE CONTRASEÑA - Guía Completa

## Resumen

Se implementó un flujo completo de recuperación de contraseña con:
- ✅ Página de "Olvidé mi contraseña"
- ✅ Email de reset automático con link
- ✅ Página para cambiar contraseña
- ✅ Integración en el login cuando hay error de credenciales

---

## 🔄 Flujo Completo

```
1. Usuario en Login.jsx
   ↓
2. Ingresa email + contraseña incorrecta
   ↓
3. Aparece error: "Invalid login credentials"
   ↓ (Opción A: Click en "¿Olvidaste tu contraseña?")
4. Va a ForgotPassword.jsx
   ↓
5. Ingresa email
   ↓
6. Se envía email con link de reset
   ↓
7. Usuario hace click en link del email
   ↓
8. Se abre ResetPassword.jsx con sesión válida
   ↓
9. Ingresa nueva contraseña 2 veces
   ↓
10. Cambio de contraseña exitoso
    ↓
11. Redirige a Login.jsx automáticamente
```

---

## 📄 Archivos Creados

### 1. `src/pages/ForgotPassword.jsx`
**Responsabilidad:** Solicitar reset de contraseña por email

**Funcionalidad:**
- Formulario con solo email
- Validación de email
- Llama a `authService.resetPassword(email)`
- Supabase envía email automático con link
- Muestra confirmación cuando se envía

**Estado:**
- ✅ Completo
- ✅ Con validación
- ✅ Con confirmación visual

### 2. `src/pages/ResetPassword.jsx`
**Responsabilidad:** Cambiar contraseña con token de reset

**Funcionalidad:**
- Verifica que hay sesión válida (token del email)
- Formulario con 2 campos de contraseña
- Muestra si contraseñas coinciden
- Botón toggle para mostrar/ocultar contraseñas
- Cambia contraseña con `supabase.auth.updateUser()`
- Redirige a login después del éxito

**Estado:**
- ✅ Completo
- ✅ Con validación
- ✅ Con manejo de errores de sesión expirada

### 3. Actualizaciones a `src/pages/Login.jsx`
**Cambios:**
- ✅ Agregó link a ForgotPassword en el footer
- ✅ Agregó link a ForgotPassword cuando hay error "Invalid login credentials"

**Antes:**
```jsx
{error && (
  <div>...error message...</div>
)}
```

**Después:**
```jsx
{error && (
  <div>
    <p>{error}</p>
    {error.includes('Invalid login credentials') && (
      <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
    )}
  </div>
)}
```

### 4. Actualizaciones a `src/App.jsx`
**Cambios:**
- ✅ Importadas páginas ForgotPassword y ResetPassword
- ✅ Agregadas 2 nuevas rutas:
  ```javascript
  <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  ```

---

## 🔧 Métodos del AuthService

### `resetPassword(email)`
Solicita reset de contraseña para un email

```javascript
const result = await authService.resetPassword('user@email.com')

// Retorna:
// {
//   success: true,
//   message: 'Revisa tu email para instrucciones de reinicio'
// }
// o
// {
//   success: false,
//   error: 'Error al solicitar el reset de contraseña'
// }
```

**Lo que hace:**
1. Envía email a través de Supabase Auth
2. Email incluye un link con token de reset
3. Link redirige a `/reset-password`
4. Supabase establece sesión automáticamente

---

## 🎯 Cómo Usar

### Para Usuarios
1. **En la pantalla de Login:**
   - Click en "¿Olvidaste tu contraseña?"
   - O ingresa credenciales incorrectas y verás la opción

2. **En ForgotPassword:**
   - Ingresa tu email
   - Click en "Enviar Email de Reset"
   - Verifica tu email (incluido spam)

3. **En el Email:**
   - Click en el link de reset
   - Se abre ResetPassword.jsx

4. **En ResetPassword:**
   - Ingresa nueva contraseña 2 veces
   - Debe tener mínimo 8 caracteres
   - Click en "Cambiar Contraseña"
   - Se redirige a Login

### Para Desarrolladores

**Usar en componentes:**
```javascript
import { authService } from '@/services/authService'

// Solicitar reset
const result = await authService.resetPassword(email)
if (result.success) {
  // Mostrar mensaje de éxito
} else {
  // Mostrar error
}
```

---

## ⚙️ Configuración en Supabase

### ✅ Ya Configurado
- Email de reset está configurado en Supabase
- Redirect URL es: `${window.location.origin}/reset-password`
- Template de email por defecto

### Personalizar Email (Opcional)
Si quieres personalizar el email que se envía:

1. Ve a Supabase Dashboard
2. Authentication → Email Templates
3. Edita "Reset Password" template
4. Personaliza el mensaje y el link

---

## 🔐 Seguridad

### Medidas Implementadas
- ✅ Email verificado antes de reset
- ✅ Token válido solo por 1 hora (por defecto en Supabase)
- ✅ Sesión requerida para cambiar contraseña
- ✅ Validación de contraseña en frontend (8+ caracteres)
- ✅ Validación en backend (Supabase)

### Lo Que NO Se Puede Hacer
- ❌ Cambiar contraseña sin token válido
- ❌ Usar link del email después de expirado
- ❌ Cambiar contraseña de otro usuario
- ❌ Contraseña menor a 8 caracteres

---

## 🧪 Testear Manualmente

### Paso 1: Test Happy Path
```
1. Abre http://localhost:5173/login
2. Ingresa: test@test.com + contraseña_mala
3. Click en "¿Olvidaste tu contraseña?"
4. Deberías estar en /forgot-password
```

### Paso 2: Test Reset Email
```
1. En ForgotPassword, ingresa un email válido
2. Click en "Enviar Email de Reset"
3. Deberías ver confirmación
```

### Paso 3: Test Reset en Supabase (Simular Email)
```
1. Ve a Supabase Dashboard
2. Authentication → Users
3. Busca tu usuario
4. Click en "..." → "Reset password"
5. Supabase genera un link válido
6. Copia el link y pégalo en navegador
7. Deberías estar en /reset-password con sesión
```

### Paso 4: Test Cambiar Contraseña
```
1. En ResetPassword, ingresa nueva contraseña
2. Confirma contraseña
3. Click en "Cambiar Contraseña"
4. Deberías ver confirmación
5. Deberías redirigir a /login
6. Intenta login con nueva contraseña
```

---

## ⚠️ Troubleshooting

### Problema: "Link de reset inválido o expirado"
**Causas:**
- Link expiró (más de 1 hora)
- Sesión se cerró
- Token no es válido

**Solución:**
- Solicita nuevo reset desde ForgotPassword

### Problema: No llega el email
**Causas:**
- Email va a spam
- Dirección incorrecta
- Supabase no configurado correctamente

**Solución:**
- Revisa carpeta de spam
- Verifica email en form
- Revisa logs en Supabase Dashboard

### Problema: "Las contraseñas no coinciden"
**Causas:**
- Escribiste diferente en ambos campos
- Caps Lock activado

**Solución:**
- Revisa que coincidan
- Usa botón de "mostrar contraseña"

### Problema: Cambio de contraseña da error
**Causas:**
- Sesión expirada
- Contraseña muy corta (<8 caracteres)
- Error de conexión

**Solución:**
- Solicita nuevo reset
- Usa contraseña más larga
- Revisa internet

---

## 📊 Comparación: Antes vs Después

### Antes
- ❌ No había opción de recuperar contraseña
- ❌ Si olvidabas contraseña, eras usuario perdido
- ❌ Error genérico sin ayuda

### Después
- ✅ Página ForgotPassword
- ✅ Email automático con link
- ✅ Página ResetPassword
- ✅ Link visible en error de login
- ✅ Flujo completo y seguro

---

## 📝 Próximos Pasos (Opcionales)

### Mejoras Posibles
1. **Notificación de cambio exitoso**
   - Email confirmando que contraseña cambió
   
2. **Logout de todas las sesiones**
   - Cuando cambias contraseña, cierras sesión en otros dispositivos

3. **Historial de cambios**
   - Guardar cuándo cambió contraseña

4. **2FA (Two-Factor Authentication)**
   - Agregar verificación en 2 pasos

5. **Código de recuperación**
   - Si pierdes acceso a email

---

## 🎓 Aprendizajes

### Flujo de Auth en Supabase
1. `signUp()` - Crear usuario
2. `signIn()` - Iniciar sesión
3. `resetPasswordForEmail()` - Enviar email de reset
4. `updateUser()` - Cambiar contraseña
5. `signOut()` - Cerrar sesión

### Componentes Reutilizables
- ForgotPassword.jsx - Solicitar reset (puede usarse en móvil)
- ResetPassword.jsx - Cambiar contraseña (puede usarse en email)

---

## ✅ Checklist

- [x] Página ForgotPassword creada
- [x] Página ResetPassword creada
- [x] Login.jsx actualizado con link
- [x] App.jsx actualizado con rutas
- [x] authService.resetPassword() existe
- [x] Email automático configurado
- [x] Validación en ambas páginas
- [x] Error handling completo
- [x] Documentación creada

---

## 📞 Preguntas Frecuentes

### ¿Cuánto tiempo dura el link?
Por defecto en Supabase, 1 hora

### ¿Puedo personalizar el email?
Sí, en Supabase Dashboard → Email Templates

### ¿Qué pasa si cierro la pestaña?
Pierdes la sesión, tienes que hacer reset de nuevo

### ¿Puedo cambiar contraseña sin email?
No, el email es el método de verificación

### ¿Se notifica al usuario cuando cambia?
Supabase lo maneja internamente, puedes agregar notificación adicional

---

**Recuperación de contraseña completamente implementada ✨**
