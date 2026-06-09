// CreateProduct.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { supabase } from '@/lib/supabase'

const MAX_IMAGE_SIZE = 300 * 1024 // 300 KB

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addProduct, loading } = useProductStore()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_value: '',
    quantity_unit: 'unidades',
    quantity_notes: '',
    availability_frequency: '',
    category: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > MAX_IMAGE_SIZE) {
      setError('La imagen no debe superar los 300 KB')
      return
    }

    setImageFile(file)
    setError('')
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, {
        upsert: false,
        contentType: imageFile.type,
      })

    if (error) throw error

    return filePath
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.quantity_value || !formData.availability_frequency) {
      setError('Completa todos los campos obligatorios')
      return
    }

    try {
      let imagePath = null

      if (imageFile) {
        imagePath = await uploadImage()
      }

      // Construir quantity como string descriptivo
      const quantityString = `${formData.quantity_value} ${formData.quantity_unit}`

      const result = await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        quantity: quantityString,
        quantity_notes: formData.quantity_notes,
        availability_frequency: formData.availability_frequency,
        category: formData.category,
        image_path: imagePath,
        producer_id: user.id,
        created_at: new Date().toISOString(),
      })

      if (result.success) {
        navigate('/producer')
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error(err)
      setError('Error al subir la imagen o guardar el producto')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Publicar nuevo producto</h1>
      <p className="text-gray-600 mb-6">
        Llena los datos de tu producto para publicarlo
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto *"
            className="input-base"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-base"
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
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="input-base"
          placeholder="Descripción del producto"
        />

        <div>
          <select
            name="availability_frequency"
            value={formData.availability_frequency}
            onChange={handleChange}
            className="input-base"
            required
          >
            <option value="">Frecuencia de disponibilidad *</option>
            <option value="semanal">📅 Semanal</option>
            <option value="quincenal">📅 Quincenal</option>
            <option value="mensual">📅 Mensual</option>
            <option value="segun_cosecha">🌱 Según cosecha</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            name="quantity_value"
            value={formData.quantity_value}
            onChange={handleChange}
            placeholder="Cantidad disponible *"
            className="input-base"
            required
            min="0"
            step="0.01"
          />

          <select
            name="quantity_unit"
            value={formData.quantity_unit}
            onChange={handleChange}
            className="input-base"
            required
          >
            <option value="unidades">Unidades</option>
            <option value="kilos">Kilos (kg)</option>
            <option value="arrobas">Arrobas</option>
            <option value="litros">Litros</option>
            <option value="toneladas">Toneladas</option>
            <option value="libras">Libras</option>
            <option value="semovientes">Semovientes</option>
            <option value="hectareas">Hectáreas</option>
          </select>
        </div>

        <input
          type="text"
          name="quantity_notes"
          value={formData.quantity_notes}
          onChange={handleChange}
          placeholder="Ej: 30 pollos/mes, 80 kilos quincenal, por demanda..."
          className="input-base"
        />

        <div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-base"
            placeholder="Precio por unidad/kilo/arroba *"
            step="0.01"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Escribe 0 si el precio varía según negociación</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagen del producto (máx 300 KB)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-base"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Publicando...' : '📢 Publicar producto'}
          </button>

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
