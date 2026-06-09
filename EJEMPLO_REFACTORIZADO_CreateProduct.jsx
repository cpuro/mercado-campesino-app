/**
 * CreateProduct.jsx - VERSIÓN REFACTORIZADA
 * 
 * Arquitectura mejorada: Services → Stores → UI
 * 
 * Cambios:
 * - Validación → validationService
 * - Upload → uploadService
 * - Creación → productService
 * - Estado → useProductStore
 * 
 * Beneficios:
 * ✅ UI limpia (solo presentación)
 * ✅ Lógica reutilizable (servicios)
 * ✅ Fácil testear (servicios independientes)
 * ✅ Mantenible (una fuente de verdad)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import {
  validationService,
  uploadService,
  productService
} from '@/services'

const PRODUCT_CATEGORIES = [
  'Vegetales',
  'Frutas',
  'Lácteos',
  'Granos',
  'Otros'
]

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addProduct, loading } = useProductStore()

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  })

  // Estado de archivo y error
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Maneja cambios en inputs de texto
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario comienza a corregir
    if (error) setError('')
  }

  /**
   * Maneja selección de imagen
   * Validación usando uploadService
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ✅ Validar usando servicio
    const validation = uploadService.validateImage(file)
    if (!validation.valid) {
      setError(validation.error)
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Guardar archivo y preview
    setImageFile(file)
    
    // Generar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    
    setError('')
  }

  /**
   * Maneja submit del formulario
   * Orquesta: Validación → Upload → Crear → Navegar
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // 1️⃣ VALIDAR datos del producto
      // ✅ Usar validationService
      const validation = validationService.validateProduct(formData)
      if (!validation.valid) {
        setError(validation.error)
        setIsSubmitting(false)
        return
      }

      // 2️⃣ UPLOAD de imagen (si existe)
      let imagePath = null
      if (imageFile) {
        // ✅ Usar uploadService
        const uploadResult = await uploadService.uploadImage(
          imageFile,
          user.id,
          {
            bucket: 'product-images',
            folder: 'products'
          }
        )

        if (!uploadResult.success) {
          setError(uploadResult.error)
          setIsSubmitting(false)
          return
        }

        imagePath = uploadResult.path
      }

      // 3️⃣ CREAR producto
      // ✅ Usar productService
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image_path: imagePath,
        producer_id: user.id,
        created_at: new Date().toISOString(),
      }

      const result = await productService.createProduct(productData)

      if (!result.success) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      // 4️⃣ ACTUALIZAR store local
      // Esto notificará a otros componentes que se suscribieron
      addProduct(result.product)

      // 5️⃣ NAVEGAR al dashboard
      navigate('/producer-dashboard', {
        state: { message: 'Producto creado exitosamente' }
      })

    } catch (err) {
      // Manejo de errores inesperados
      console.error('Error al crear producto:', err)
      setError('Ocurrió un error inesperado. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Crear Nuevo Producto
        </h1>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ej: Tomates frescos"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu producto"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio (USD) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad disponible *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen del Producto
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Máximo 300 KB (JPG, PNG, WebP)
              </p>
            </div>

            {/* Preview de imagen */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
                isSubmitting || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting || loading ? 'Guardando...' : 'Crear Producto'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/producer-dashboard')}
              className="w-full py-2 px-4 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
