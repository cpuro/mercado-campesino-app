// Hook de React para manejar estado local
import { useState } from 'react'

// Hook para redirigir entre rutas
import { useNavigate } from 'react-router-dom'

// Store de autenticación (usuario actual)
import { useAuthStore } from '@/stores/authStore'

// Store de productos (acción para crear y estado de guardado)
import { useProductStore } from '@/stores/productStore'

// Esquema y utilidades de validación / sanitización
import { productSchema, validateData, sanitizeData } from '@/lib/validation'

// Función que sube la imagen del producto a Supabase Storage
import { uploadProductImage } from '@/lib/supabase'

// Tamaño máximo permitido para la imagen (300 KB)
const MAX_IMAGE_SIZE = 300 * 1024

// Tipos de imagen permitidos
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Componente para publicar un nuevo producto
export default function CreateProduct() {

  // Función para redirigir entre páginas
  const navigate = useNavigate()

  // Usuario autenticado (productor que publica)
  const { user } = useAuthStore()

  // Acción para crear el producto y estado de guardado
  const { addProduct, loading } = useProductStore()

  // Estado con los datos del formulario
  const [formData, setFormData] = useState({
    name: '',                  // Nombre del producto
    description: '',           // Descripción
    price: '',                // Precio
    quantity_value: '',       // Cantidad disponible
    quantity_unit: 'unidades',// Unidad de medida
    quantity_notes: '',       // Notas sobre la cantidad
    availability_frequency: '',// Frecuencia de disponibilidad
    category: '',             // Categoría
  })

  // Imagen seleccionada por el usuario
  const [imageFile, setImageFile] = useState(null)

  // Errores de validación por campo
  const [validationErrors, setValidationErrors] = useState({})

  // Error general del formulario
  const [error, setError] = useState(null)

  // Indica si la imagen se está subiendo
  const [uploading, setUploading] = useState(false)

  /**
   * Actualiza un campo del formulario y limpia su error
   * cuando el usuario empieza a corregirlo.
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  /**
   * Valida la imagen seleccionada (tipo y tamaño)
   * antes de aceptarla.
   */
  const handleImageChange = (e) => {
    // Primer archivo seleccionado
    const file = e.target.files[0]
    if (!file) return

    // Rechaza formatos no permitidos
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setValidationErrors(prev => ({
        ...prev,
        image: 'Solo se permiten imágenes JPG, PNG o WebP'
      }))
      return
    }

    // Rechaza imágenes que superan el tamaño máximo
    if (file.size > MAX_IMAGE_SIZE) {
      setValidationErrors(prev => ({
        ...prev,
        image: 'La imagen no debe superar los 300 KB'
      }))
      return
    }

    // Guarda la imagen y limpia el error de imagen
    setImageFile(file)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.image
      return newErrors
    })
  }

  /**
   * Valida y sanitiza los datos, sube la imagen (si hay)
   * y crea el producto en la base de datos.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Valida los datos del formulario contra el esquema
    const validation = validateData(productSchema, {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      quantity_value: formData.quantity_value ? parseFloat(formData.quantity_value) : null,
    })

    // Si hay errores, los muestra y detiene el envío
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    // Limpia los datos para evitar inyección / XSS
    const sanitized = sanitizeData(validation.data)

    try {
      // Ruta de la imagen (null si no se sube ninguna)
      let imagePath = null

      // ✅ Sube la imagen directo a Supabase Storage si existe
      if (imageFile) {
        setUploading(true)
        const uploadData = await uploadProductImage(imageFile, user.id)
        imagePath = uploadData.path
        setUploading(false)
      }

      // Une cantidad y unidad en un solo texto (ej: "50 kg")
      const quantityString = `${sanitized.quantity_value} ${sanitized.quantity_unit}`

      // Crea el producto en la base de datos
      const result = await addProduct({
        name: sanitized.name,
        description: sanitized.description,
        price: sanitized.price,
        quantity: quantityString,
        quantity_notes: sanitized.quantity_notes,
        availability_frequency: sanitized.availability_frequency,
        category: sanitized.category,
        image_path: imagePath,
        producer_id: user.id,
        created_at: new Date().toISOString(),
      })

      // Si se creó, vuelve al panel; si no, muestra el error
      if (result.success) {
        navigate('/producer')
      } else {
        setError(result.error)
      }
    } catch (err) {
      // Cualquier fallo (imagen o guardado) cae aquí
      console.error(err)
      setUploading(false)
      setError('Error al subir la imagen o guardar el producto')
    }
  }

  // True mientras se guarda el producto o se sube la imagen
  const isSubmitting = loading || uploading

  // Renderizado visual
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold mb-2">Publicar nuevo producto</h1>
      <p className="text-gray-600 mb-6">Llena los datos de tu producto para publicarlo</p>

      {/* Mensaje de error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulario de creación de producto */}
      <form onSubmit={handleSubmit} className="card space-y-6">

        {/* Fila: nombre y categoría */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nombre del producto */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del producto *"
              className={`input-base ${validationErrors.name ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.name}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-base ${validationErrors.category ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Categoría *</option>
              <option value="aves">🐔 Aves (Pollo / Gallina)</option>
              <option value="cerdos">🐷 Cerdos</option>
              <option value="bovinos">🐄 Ganadería / Bovinos</option>
              <option value="huevos">🥚 Huevos</option>
              <option value="lacteos">🥛 Lácteos (Leche/Queso)</option>
              <option value="platano">🍌 Plátano</option>
              <option value="maiz">🌽 Maíz</option>
              <option value="yuca">🥔 Yuca / Ñame</option>
              <option value="pesca">🐟 Pesca (Cachama / otros)</option>
              <option value="frutas">🍎 Frutas</option>
              <option value="otros">📦 Otros</option>
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.category}</p>
            )}
          </div>
        </div>

        {/* Descripción del producto */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`input-base ${validationErrors.description ? 'border-red-500' : ''}`}
            placeholder="Descripción del producto (máximo 500 caracteres)"
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.description}</p>
          )}
        </div>

        {/* Frecuencia de disponibilidad */}
        <div>
          <select
            name="availability_frequency"
            value={formData.availability_frequency}
            onChange={handleChange}
            className={`input-base ${validationErrors.availability_frequency ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Frecuencia de disponibilidad *</option>
            <option value="diaria">📅 Diaria</option>
            <option value="semanal">📅 Semanal</option>
            <option value="quincenal">📅 Quincenal</option>
            <option value="mensual">📅 Mensual</option>
            <option value="puntual">🌱 Puntual</option>
          </select>
          {validationErrors.availability_frequency && (
            <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.availability_frequency}</p>
          )}
        </div>

        {/* Fila: cantidad y unidad */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Cantidad disponible */}
          <div>
            <input
              type="number"
              name="quantity_value"
              value={formData.quantity_value}
              onChange={handleChange}
              placeholder="Cantidad disponible *"
              className={`input-base ${validationErrors.quantity_value ? 'border-red-500' : ''}`}
              required
              min="0"
              step="0.01"
            />
            {validationErrors.quantity_value && (
              <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.quantity_value}</p>
            )}
          </div>

          {/* Unidad de medida */}
          <div>
            <select
              name="quantity_unit"
              value={formData.quantity_unit}
              onChange={handleChange}
              className={`input-base ${validationErrors.quantity_unit ? 'border-red-500' : ''}`}
              required
            >
              <option value="unidades">Unidades</option>
              <option value="kg">Kilos (kg)</option>
              <option value="litros">Litros</option>
              <option value="docenas">Docenas</option>
              <option value="paquetes">Paquetes</option>
            </select>
            {validationErrors.quantity_unit && (
              <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.quantity_unit}</p>
            )}
          </div>
        </div>

        {/* Notas sobre la cantidad */}
        <div>
          <input
            type="text"
            name="quantity_notes"
            value={formData.quantity_notes}
            onChange={handleChange}
            placeholder="Ej: Disponible según disponibilidad..."
            className={`input-base ${validationErrors.quantity_notes ? 'border-red-500' : ''}`}
          />
          {validationErrors.quantity_notes && (
            <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.quantity_notes}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`input-base ${validationErrors.price ? 'border-red-500' : ''}`}
            placeholder="Precio por unidad/kilo *"
            step="0.01"
            required
          />
          {validationErrors.price && (
            <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.price}</p>
          )}
          {/* Aclaración para el productor */}
          <p className="text-xs text-gray-500 mt-1">Escribe 0 si el precio varía según negociación</p>
        </div>

        {/* Imagen del producto */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen del producto (máx 300 KB - JPG, PNG, WebP)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
            className={`input-base ${validationErrors.image ? 'border-red-500' : ''}`}
          />
          {validationErrors.image && (
            <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.image}</p>
          )}
          {/* Indicador mientras sube la imagen */}
          {uploading && (
            <p className="text-blue-500 text-sm mt-1">⏳ Subiendo imagen...</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {/* Publicar (deshabilitado mientras se procesa) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {uploading ? 'Subiendo imagen...' : loading ? 'Publicando...' : '📢 Publicar producto'}
          </button>

          {/* Cancelar y volver al panel */}
          <button
            type="button"
            onClick={() => navigate('/producer')}
            className="btn-ghost flex-1"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

/*
Resumen de las variables más importantes
Variable -------------------	Función
user -----------------------	Usuario autenticado (productor)
formData -------------------	Datos del formulario
imageFile ------------------	Imagen seleccionada
validationErrors -----------	Errores por campo
error ----------------------	Error general
uploading ------------------	Estado de subida de imagen
loading --------------------	Estado de guardado del producto
isSubmitting ---------------	True si se está guardando o subiendo imagen
MAX_IMAGE_SIZE -------------	Tamaño máximo de imagen (300 KB)
ALLOWED_IMAGE_TYPES --------	Formatos de imagen permitidos
handleChange() -------------	Actualiza campos del formulario
handleImageChange() --------	Valida la imagen (tipo y tamaño)
handleSubmit() -------------	Valida, sube imagen y publica el producto
addProduct() ---------------	Inserta el producto en la base de datos
uploadProductImage() -------	Guarda la imagen en Supabase Storage
navigate() -----------------	Redirige entre páginas

Este componente implementa el flujo completo de creación de productos,
incluyendo validación de datos, validación de archivos,
almacenamiento en Supabase Storage y persistencia en la base de datos.
*/
