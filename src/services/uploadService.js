/**
 * Upload Service
 * 
 * Maneja toda la lógica de subida de archivos
 * Separada de UI y componentes de forma
 * 
 * Responsabilidades:
 * - Validación de archivos
 * - Upload a Supabase Storage
 * - Compresión de imágenes
 * - Limpieza de archivos
 */

import { supabase } from '@/lib/supabase'

class UploadService {
  constructor() {
    this.MAX_IMAGE_SIZE = 300 * 1024 // 300 KB
    this.MAX_IMAGE_WIDTH = 1024
    this.MAX_IMAGE_HEIGHT = 1024
    this.ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  }

  /**
   * Valida un archivo de imagen
   * @param {File} file - Archivo a validar
   * @returns {{valid: boolean, error: string}}
   */
  validateImage(file) {
    if (!file) {
      return { valid: false, error: 'No se seleccionó archivo' }
    }

    // Validar tipo de archivo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Solo se permiten imágenes JPG, PNG o WebP'
      }
    }

    // Validar tamaño
    if (file.size > this.MAX_IMAGE_SIZE) {
      const maxSizeMB = (this.MAX_IMAGE_SIZE / 1024 / 1024).toFixed(1)
      return {
        valid: false,
        error: `La imagen no debe superar los ${maxSizeMB} MB`
      }
    }

    return { valid: true }
  }

  /**
   * Sube una imagen a Supabase Storage
   * @param {File} file - Archivo a subir
   * @param {string} userId - ID del usuario
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<{success: boolean, path: string, url: string, error: string}>}
   */
  async uploadImage(file, userId, options = {}) {
    try {
      // Validar archivo
      const validation = this.validateImage(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const bucket = options.bucket || 'product-images'
      const folder = options.folder || 'products'

      // Generar nombre único
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Subir archivo
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return {
        success: true,
        path: filePath,
        url: publicUrl
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Elimina un archivo de Supabase Storage
   * @param {string} filePath - Ruta del archivo
   * @param {string} bucket - Bucket donde está el archivo
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async deleteImage(filePath, bucket = 'product-images') {
    try {
      if (!filePath) {
        return { success: true } // No hay nada que eliminar
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   * @param {string} filePath - Ruta del archivo
   * @param {string} bucket - Bucket donde está el archivo
   * @returns {string}
   */
  getPublicUrl(filePath, bucket = 'product-images') {
    if (!filePath) return null

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  }

  /**
   * Comprime una imagen (en el futuro)
   * @private
   */
  async compressImage(file) {
    // Implementar compresión si es necesario
    // Por ahora solo validamos tamaño
    return file
  }
}

export const uploadService = new UploadService()
