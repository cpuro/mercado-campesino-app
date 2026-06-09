/**
 * Product Service
 * 
 * Maneja toda la lógica de productos
 * Separada de UI y state management
 * 
 * Responsabilidades:
 * - CRUD de productos
 * - Búsqueda y filtrado
 * - Validación de datos de producto
 * - Gestión de categorías
 */

import { supabase } from '@/lib/supabase'

class ProductService {
  /**
   * Obtiene todos los productos
   * @param {Object} options - Opciones de filtrado
   * @param {string} options.category - Filtrar por categoría
   * @param {string} options.search - Buscar por nombre
   * @param {number} options.limit - Límite de resultados
   * @param {number} options.offset - Offset para paginación
   * @returns {Promise<{success: boolean, products: Array, total: number, error: string}>}
   */
  async fetchProducts(options = {}) {
    try {
      const { category, search, limit = 50, offset = 0 } = options

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, count, error } = await query
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        success: true,
        products: data || [],
        total: count || 0
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<{success: boolean, product: Object, error: string}>}
   */
  async fetchProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        success: true,
        product: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene productos de un productor específico
   * @param {string} producerId - ID del productor
   * @returns {Promise<{success: boolean, products: Array, error: string}>}
   */
  async fetchProducerProducts(producerId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('producer_id', producerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        products: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<{success: boolean, product: Object, error: string}>}
   */
  async createProduct(productData) {
    try {
      // Validar datos
      const validation = this.validateProductData(productData)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        product: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Actualiza un producto existente
   * @param {string} id - ID del producto
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<{success: boolean, product: Object, error: string}>}
   */
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        product: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Elimina un producto
   * @param {string} id - ID del producto a eliminar
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

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
   * Obtiene las categorías disponibles
   * @returns {Promise<{success: boolean, categories: Array, error: string}>}
   */
  async fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      // Obtener categorías únicas
      const categories = [...new Set(data.map(p => p.category))]

      return {
        success: true,
        categories: categories.sort()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Valida los datos de un producto
   * @private
   */
  validateProductData(data) {
    const { name, price, quantity, producer_id } = data

    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'El nombre del producto es obligatorio' }
    }

    if (!price || price <= 0) {
      return { valid: false, error: 'El precio debe ser mayor a 0' }
    }

    if (quantity === undefined || quantity < 0) {
      return { valid: false, error: 'La cantidad debe ser válida' }
    }

    if (!producer_id) {
      return { valid: false, error: 'El ID del productor es obligatorio' }
    }

    return { valid: true }
  }
}

export const productService = new ProductService()
