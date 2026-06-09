# 🏗️ DIAGRAMA DE ARQUITECTURA PROFESIONAL

## Comparación: Antes vs Después

### ❌ ANTES (Arquitéctura Mezclada - No Escalable)

```
┌─────────────────────────────────────────────────────┐
│           UI Component (CreateProduct.jsx)          │
├─────────────────────────────────────────────────────┤
│ ❌ Validación inline                                │
│ ❌ Upload logic                                     │
│ ❌ Llamadas directas a Supabase                    │
│ ❌ Navigation                                       │
│ ❌ Error handling                                   │
│ ❌ TODO MEZCLADO EN UN COMPONENTE                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
        ┌────────────────┐
        │    Supabase    │
        │   (Backend)    │
        └────────────────┘

PROBLEMAS:
- Difícil mantener
- Difícil testear
- Código duplicado
- Acoplado a Supabase
- Si Supabase cambia, tengo que tocar todos los componentes
```

---

### ✅ DESPUÉS (Arquitectura Profesional - Escalable)

```
┌──────────────────────────────────────────────────────────┐
│         UI Components (React JSX - Clean)               │
│  CreateProduct.jsx, Login.jsx, Catalog.jsx, etc.        │
│                                                           │
│  Responsabilidades:                                      │
│  ✅ Render UI                                           │
│  ✅ Capturar eventos                                    │
│  ✅ Mostrar errores/loading                             │
└────────────────────┬─────────────────────────────────────┘
                     │ usa
                     ↓
┌──────────────────────────────────────────────────────────┐
│    ZUSTAND STORES (State Management)                     │
│  authStore.js, productStore.js                          │
│                                                           │
│  Responsabilidades:                                      │
│  ✅ Cachear estado local                                │
│  ✅ Persistir datos en memoria                          │
│  ✅ Notificar cambios a componentes                     │
│  ✅ Llamar servicios                                    │
└────────────────────┬─────────────────────────────────────┘
                     │ usa
                     ↓
┌──────────────────────────────────────────────────────────┐
│    SERVICES LAYER (Business Logic)                       │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  authService.js                                  │   │
│  │  - signUp()        - signIn()                    │   │
│  │  - signOut()       - resetPassword()             │   │
│  │  - validateEmail() - validatePassword()          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  productService.js                               │   │
│  │  - fetchProducts()     - createProduct()         │   │
│  │  - updateProduct()     - deleteProduct()         │   │
│  │  - fetchCategories()   - validateProductData()   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  uploadService.js                                │   │
│  │  - validateImage()     - uploadImage()           │   │
│  │  - deleteImage()       - getPublicUrl()          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  validationService.js                            │   │
│  │  - validateEmail()     - validateProduct()       │   │
│  │  - validatePassword()  - validatePhone()         │   │
│  │  - validateForm()                                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  Responsabilidades:                                      │
│  ✅ Lógica de negocio                                   │
│  ✅ Validaciones centralizadas                         │
│  ✅ Reutilizable en cualquier contexto                │
│  ✅ Fácil testear (sin React)                         │
│  ✅ Independiente del frontend                        │
└────────────────────┬─────────────────────────────────────┘
                     │ usa
                     ↓
┌──────────────────────────────────────────────────────────┐
│    SUPABASE CLIENT (lib/supabase.js)                     │
│                                                           │
│  Responsabilidades:                                      │
│  ✅ Configurar cliente Supabase                        │
│  ✅ Manejar tokens                                    │
│  ✅ Conectar con backend                             │
└────────────────────┬─────────────────────────────────────┘
                     │ llama
                     ↓
┌──────────────────────────────────────────────────────────┐
│    SUPABASE BACKEND (Backend as a Service)               │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │   PostgreSQL     │  │ Row Level        │             │
│  │   Database       │  │ Security (RLS)   │             │
│  │                  │  │                  │             │
│  │ - users table    │  │ Cada usuario     │             │
│  │ - products       │  │ ve solo sus      │             │
│  │ - orders         │  │ datos            │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  Storage         │  │ Authentication   │             │
│  │  (Bucket)        │  │ (JWT)            │             │
│  │                  │  │                  │             │
│  │ - product-images │  │ email/password   │             │
│  │ - files          │  │ OAuth ready      │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  Responsabilidades:                                      │
│  ✅ Persistencia de datos                              │
│  ✅ Autenticación                                      │
│  ✅ Almacenamiento de archivos                         │
│  ✅ RLS (seguridad a nivel de fila)                    │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Completo: Crear Producto

```
1. USUARIO INTERACTÚA
   └─ Llena formulario en CreateProduct.jsx
   └─ Hace clic en "Guardar"

2. COMPONENTE (CreateProduct.jsx)
   └─ Recopila datos del formulario
   └─ Valida que user esté logueado
   └─ Prepara para enviar

3. SERVICIO DE VALIDACIÓN
   └─ validationService.validateProduct(formData)
   └─ ¿Nombre presente? ✓
   └─ ¿Precio válido? ✓
   └─ ¿Cantidad válida? ✓
   └─ Si error: retorna {success: false, error: "..."}
   └─ Componente muestra error y detiene

4. SERVICIO DE UPLOAD (si hay imagen)
   └─ uploadService.uploadImage(file, userId)
   └─ Valida tipo: JPEG/PNG/WebP ✓
   └─ Valida tamaño: < 300 KB ✓
   └─ Sube a Supabase Storage
   └─ Retorna {success: true, path, url}
   └─ Componente guarda path para BD

5. SERVICIO DE PRODUCTO
   └─ productService.createProduct(productData)
   └─ Valida datos nuevamente
   └─ Prepara INSERT statement
   └─ Llama a supabase.from('products').insert()
   └─ Retorna {success: true, product}

6. SUPABASE BACKEND
   └─ Valida authentikasi (JWT)
   └─ Ejecuta RLS: ¿El usuario puede insertar?
   └─ Inserta en tabla products
   └─ Retorna producto creado

7. SERVICIO retorna RESPUESTA
   └─ {success: true, product: {...}}

8. STORE (productStore.js)
   └─ Actualiza estado: products.push(newProduct)
   └─ Notifica a TODOS los componentes suscritos
   └─ Los componentes se re-renderizan con nuevos datos

9. COMPONENTE actualiza UI
   └─ Muestra "Producto creado"
   └─ Navega a /producer-dashboard
   └─ Dashboard ya tiene producto actualizado
       (porque está suscrito al store)

10. USUARIO VE RESULTADO
    └─ Nuevo producto aparece en su dashboard
    └─ Puede empezar a venderlo
```

---

## 📊 Matriz de Responsabilidades

| Capa | Componentes | Responsabilidades | Testeable |
|---|---|---|---|
| **UI** | CreateProduct.jsx, Login.jsx, etc. | Render, eventos, mostrar estado | ✅ Con testing library |
| **State** | authStore.js, productStore.js | Caché local, sincronización | ✅ Con vitest |
| **Services** | authService.js, productService.js | Lógica de negocio, validaciones | ✅ Sin React (fácil) |
| **API** | lib/supabase.js | Conexión al backend | ✅ Con mocks |
| **Backend** | PostgreSQL, Storage | Persistencia, seguridad | ✅ Con tests de API |

---

## 🧩 Patrones Utilizados

### 1. **Service Layer Pattern**
- Separa lógica de negocio de UI
- Reutilizable en múltiples contextos
- Fácil de testear

### 2. **State Management (Zustand)**
- Stores manejan estado global
- Stores usan servicios (no Supabase directo)
- Componentes suscritos a cambios

### 3. **Singleton Services**
- Servicios como instancias únicas
- Importables desde cualquier lado
- Sin necesidad de inyección de dependencias compleja

### 4. **Standardized Responses**
- Todos los servicios retornan: `{success, data/error}`
- Manejo de errores consistente
- Fácil predicción de respuesta

### 5. **Single Responsibility Principle**
- Cada servicio hace UNA cosa bien
- authService = solo auth
- productService = solo productos
- uploadService = solo uploads
- validationService = solo validaciones

---

## 🎯 Beneficios de Esta Arquitectura

### Para el Desarrollo
- ✅ Componentes simples y enfocados
- ✅ Reutilización de código
- ✅ Menos duplicación
- ✅ Cambios centralizados

### Para el Testing
- ✅ Servicios sin dependencias de React
- ✅ Fácil testeo unitario
- ✅ Mocking simple
- ✅ Tests rápidos

### Para Mantenimiento
- ✅ Una fuente de verdad (servicios)
- ✅ Si regla de negocio cambia, actualizo el servicio
- ✅ No toco componentes
- ✅ Código autodocumentado

### Para Escalabilidad
- ✅ Fácil agregar nuevas funcionalidades
- ✅ Fácil cambiar backend (si migro de Supabase)
- ✅ Estructura lista para crecer
- ✅ Equipo de devs puede trabajar en paralelo

---

## 🚀 Próximas Mejoras (Opcional)

```javascript
// 1. Agregar middleware de logging
export const authServiceWithLogging = new Proxy(authService, {
  get: (target, prop) => {
    if (typeof target[prop] === 'function') {
      return async (...args) => {
        console.log(`${prop} called with`, args)
        const result = await target[prop](...args)
        console.log(`${prop} returned`, result)
        return result
      }
    }
    return target[prop]
  }
})

// 2. Agregar caché en servicios
class CachedProductService {
  constructor(baseService) {
    this.baseService = baseService
    this.cache = new Map()
  }
  
  async fetchProducts(options) {
    const key = JSON.stringify(options)
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    const result = await this.baseService.fetchProducts(options)
    this.cache.set(key, result)
    return result
  }
}

// 3. Agregar retry logic para requests que fallen
export const createRetryableService = (service, maxRetries = 3) => {
  return new Proxy(service, {
    get: (target, prop) => {
      if (typeof target[prop] === 'function') {
        return async (...args) => {
          let lastError
          for (let i = 0; i < maxRetries; i++) {
            try {
              return await target[prop](...args)
            } catch (error) {
              lastError = error
              await new Promise(r => setTimeout(r, 1000 * (i + 1)))
            }
          }
          throw lastError
        }
      }
      return target[prop]
    }
  })
}
```

---

## 📖 Documentación Adicional

- [COMO_ESTA_CREADO.md](COMO_ESTA_CREADO.md) - Arquitectura completa
- [GUIA_SERVICIOS.md](GUIA_SERVICIOS.md) - Cómo usar servicios
- [EJEMPLO_REFACTORIZADO_CreateProduct.jsx](EJEMPLO_REFACTORIZADO_CreateProduct.jsx) - Ejemplo práctico

---

**Última actualización:** Mayo 28, 2026  
**Versión:** 2.0 - Services-based Architecture  
**Status:** ✅ Implementado y Documentado
