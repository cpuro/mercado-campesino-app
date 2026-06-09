# 🚀 COMIENZA EN 5 PASOS - Separación de Lógica

## Paso 1: Entiende la Idea (5 min) ⏱️

**La lógica debe separarse en capas:**

```
UI (Componente)
    ↓
Lógica React (Hooks)
    ↓
Lógica Negocio (Services)
    ↓
API/BD (Supabase)
```

**Ejemplo:**
- ❌ Antes: `ProductForm.jsx` hace TODO (UI + validación + upload + API)
- ✅ Después: `ProductForm.jsx` solo UI + `useImageUpload()` hook + `imageService` service

---

## Paso 2: Conoce los 5 Hooks (10 min) ⏱️

### `useImageUpload()`
Valida y sube imágenes

```jsx
const { imageFile, imagePreview, handleImageChange } = useImageUpload()
```

### `useForm()`
Maneja cualquier formulario

```jsx
const { formData, handleChange, handleSubmit } = useForm(init, onSubmit)
```

### `useProducerPhones()`
Obtiene teléfonos de productores

```jsx
const { phonesMap } = useProducerPhones(producerIds)
```

### `useProductFilter()`
Filtra productos

```jsx
const filtered = useProductFilter(products, search, category)
```

### `useOrder()`
Crea órdenes

```jsx
const { createOrder } = useOrder()
```

---

## Paso 3: Conoce los 4 Services (5 min) ⏱️

### `imageService`
```javascript
await imageService.uploadProductImage(file, userId)
imageService.getImageUrl(filePath)
```

### `orderService`
```javascript
await orderService.createOrder(product, phone, quantity)
```

### `producerService`
```javascript
await producerService.getProducersPhones(ids)
```

### `productService`
```javascript
productService.filterProducts(products, search, category)
productService.validateProduct(data)
```

---

## Paso 4: Refactoriza 1 Componente (30 min) ⏱️

### Tarea: Refactoriza `Catalog.jsx`

**ANTES (70 líneas mezcladas):**
```jsx
export function Catalog() {
  // ❌ Fetch de productos
  // ❌ Fetch de teléfonos
  // ❌ Filtrado
  // ❌ Manejo de órdenes
  // ❌ UI
}
```

**DESPUÉS (25 líneas limpias):**
```jsx
import { useProducerPhones, useProductFilter, useOrder } from '@/hooks'

export function Catalog() {
  const { products } = useProductStore()
  const { phonesMap } = useProducerPhones(products.map(p => p.producer_id))
  const filtered = useProductFilter(products, search, category)
  const { createOrder } = useOrder()

  return <ProductGrid products={filtered} onOrder={createOrder} />
}
```

**Referencia:** Ver `REFACTORIZACION_PASO_A_PASO.md`

---

## Paso 5: Refactoriza 1 Más (30 min) ⏱️

### Tarea: Refactoriza `CreateProduct.jsx`

**ANTES (80 líneas):**
- Validación de imagen inline
- Estado de formulario duplicado
- Upload de archivo duplicado

**DESPUÉS (35 líneas):**
```jsx
import { useImageUpload, useForm } from '@/hooks'

export function CreateProduct() {
  const { imageFile, handleImageChange } = useImageUpload()
  const { formData, handleSubmit } = useForm(init, onSubmit)

  return (
    <ProductForm
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
    />
  )
}
```

---

## 🎯 Resultado Después de 75 Min

```
✅ Catalog.jsx:         70 → 25 líneas (-65%)
✅ CreateProduct.jsx:   80 → 35 líneas (-56%)
✅ Código reutilizable: SÍ
✅ Fácil de testear:    SÍ
✅ Fácil de mantener:   SÍ
```

---

## 📚 Documentación a Mano

| Necesito | Leer | Tiempo |
|----------|------|--------|
| Entender por qué | `ARQUITECTURA_LIMPIA.md` | 20 min |
| Ver código antes/después | `REFACTORIZACION_PASO_A_PASO.md` | 25 min |
| Referencia rápida | `REFERENCIA_RAPIDA_HOOKS_SERVICES.md` | 5 min |
| Qué archivo leer | `MAPA_LECTURA_SEPARACION_LOGICA.md` | 10 min |

---

## 💡 Reglas Simples

```
SI necesita estado      → Usa HOOK
SI es lógica pura       → Usa SERVICE
SI solo renderiza       → Solo COMPONENTE
```

---

## 📝 Ejemplos Reales

### Ejemplo 1: Image Upload
```jsx
// ✅ CORRECTO
import { useImageUpload } from '@/hooks'
import { imageService } from '@/services'

const { imageFile, handleImageChange } = useImageUpload()
const filePath = await imageService.uploadProductImage(imageFile, userId)
```

### Ejemplo 2: Crear Orden
```jsx
// ✅ CORRECTO
import { useOrder } from '@/hooks'

const { createOrder } = useOrder()
await createOrder(product, producerPhone, quantity)
```

### Ejemplo 3: Filtrar Productos
```jsx
// ✅ CORRECTO
import { useProductFilter } from '@/hooks'

const filtered = useProductFilter(products, search, category)
```

---

## ⚡ Rápido VS Lento

### ⚡ RÁPIDO (Recomendado)
1. Lee solo `REFERENCIA_RAPIDA_HOOKS_SERVICES.md` (5 min)
2. Refactoriza `Catalog.jsx` usando el ejemplo (30 min)
3. Refactoriza `CreateProduct.jsx` (30 min)
4. Lee `ARQUITECTURA_LIMPIA.md` después (20 min)

### 🐢 LENTO (Completo)
1. Lee `ARQUITECTURA_LIMPIA.md` (20 min)
2. Lee `REFACTORIZACION_PASO_A_PASO.md` (25 min)
3. Lee `REFERENCIA_RAPIDA_HOOKS_SERVICES.md` (15 min)
4. Refactoriza componentes (60 min)

---

## ✅ Checklist Final

- [ ] Leí `REFERENCIA_RAPIDA_HOOKS_SERVICES.md`
- [ ] Entiendo cómo funciona un hook
- [ ] Entiendo cómo funciona un service
- [ ] Refactoricé `Catalog.jsx`
- [ ] Refactoricé `CreateProduct.jsx`
- [ ] Sin errores en consola
- [ ] Funciona igual que antes
- [ ] Leí `ARQUITECTURA_LIMPIA.md`

---

## 🎓 Aprendiste

✅ Separación de responsabilidades  
✅ Cómo usar hooks  
✅ Cómo usar services  
✅ Cómo refactorizar código  
✅ Cómo mantener código limpio  

---

## 🚀 Ahora Puedes

✨ Crear código profesional  
✨ Reutilizar lógica  
✨ Testear fácilmente  
✨ Mantener código limpio  
✨ Escalar sin problemas  

---

## 📞 Si Te Trancas

1. **¿Cómo importo un hook?**
   ```javascript
   import { useImageUpload } from '@/hooks'
   ```

2. **¿Cómo uso un service?**
   ```javascript
   import { imageService } from '@/services'
   const result = await imageService.validateImage(file)
   ```

3. **¿Dónde está el ejemplo?**
   → `REFACTORIZACION_PASO_A_PASO.md`

4. **¿Cómo me aseguro que funcione?**
   → Abre navegador, prueba, mira consola por errores

---

## 🎯 Próxima Meta

**Refactorizar Catalog.jsx ahora**

Tiempo estimado: 30 minutos

Referencia: `REFACTORIZACION_PASO_A_PASO.md` (sección Catalog.jsx)

---

**¡Empecemos!** 🚀

Lee: `REFERENCIA_RAPIDA_HOOKS_SERVICES.md` (5 min)
Luego refactoriza: `Catalog.jsx` (30 min)
