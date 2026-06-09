import { useState } from 'react'
import { Button, Input, Select, Alert, Spinner } from '@/components/ui'

export default function ProductForm({ onSubmit, loading, error, onImageChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageError('')

    // Validar tamaño (300 KB)
    if (file.size > 300 * 1024) {
      setImageError('La imagen no debe superar los 300 KB')
      return
    }

    // Mostrar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    onImageChange(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    onSubmit({
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      quantity: parseInt(formData.get('quantity')),
      category: formData.get('category'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {imageError && <Alert type="error" message={imageError} />}

      <div>
        <label className="block text-sm font-medium mb-2">Foto del producto</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="input-base"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 w-32 object-cover rounded-lg"
          />
        )}
      </div>

      <Input
        label="Nombre del producto"
        type="text"
        name="name"
        placeholder="Ej: Tomates frescos"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <textarea
          name="description"
          placeholder="Describe tu producto..."
          className="input-base min-h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio (COP)"
          type="number"
          name="price"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
        />

        <Input
          label="Cantidad disponible"
          type="number"
          name="quantity"
          min="0"
          placeholder="0"
          required
        />
      </div>

      <Select
        label="Categoría"
        name="category"
        options={[
          { value: '', label: 'Selecciona una categoría' },
          { value: 'vegetales', label: 'Vegetales' },
          { value: 'frutas', label: 'Frutas' },
          { value: 'lacteos', label: 'Lácteos' },
          { value: 'granos', label: 'Granos' },
          { value: 'otros', label: 'Otros' },
        ]}
        required
      />

      <Button type="submit" fullWidth loading={loading}>
        {loading ? 'Publicando...' : 'Publicar producto'}
      </Button>
    </form>
  )
}
