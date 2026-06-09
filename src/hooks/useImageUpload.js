import { useState } from 'react'

const MAX_IMAGE_SIZE = 300 * 1024 // 300 KB

/**
 * Hook para manejar upload y preview de imágenes
 * @returns { imageFile, imagePreview, imageError, handleImageChange, resetImage }
 */
export function useImageUpload() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageError('')

    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`La imagen no debe superar ${MAX_IMAGE_SIZE / 1024}KB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setImageError('El archivo debe ser una imagen')
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setImageFile(file)
    }
    reader.readAsDataURL(file)
  }

  const resetImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageError('')
  }

  return {
    imageFile,
    imagePreview,
    imageError,
    handleImageChange,
    resetImage,
  }
}
