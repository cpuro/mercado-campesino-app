import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'product-images'
const MAX_SIZE = 300 * 1024 // 300 KB

/**
 * Servicio para manejar imágenes de productos
 */

export const imageService = {
  /**
   * Valida una imagen antes de subirla
   * @param { File } file - Archivo de imagen
   * @returns { Object } { isValid, error }
   */
  validateImage(file) {
    if (!file) {
      return { isValid: false, error: 'No se seleccionó imagen' }
    }

    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'El archivo debe ser una imagen' }
    }

    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        error: `La imagen no debe superar ${MAX_SIZE / 1024}KB`,
      }
    }

    return { isValid: true }
  },

  /**
   * Sube una imagen de producto a Supabase Storage
   * @param { File } file - Archivo a subir
   * @param { string } userId - ID del usuario (productor)
   * @returns { string } Ruta del archivo subido
   */
  async uploadProductImage(file, userId) {
    const validation = this.validateImage(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
        })

      if (error) throw error

      return filePath
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Error al subir la imagen')
    }
  },

  /**
   * Obtiene la URL pública de una imagen
   * @param { string } imagePath - Ruta de la imagen
   * @returns { string } URL pública
   */
  getImageUrl(imagePath) {
    if (!imagePath) return null

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(imagePath)

    return data?.publicUrl || null
  },

  /**
   * Elimina una imagen de producto
   * @param { string } imagePath - Ruta de la imagen
   * @returns { Promise<void> }
   */
  async deleteProductImage(imagePath) {
    if (!imagePath) return

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imagePath])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting image:', error)
      throw new Error('Error al eliminar la imagen')
    }
  },

  /**
   * Crea una URL de data para preview local
   * @param { File } file - Archivo a previsualizajar
   * @returns { Promise<string> } Data URL
   */
  async createImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
}
