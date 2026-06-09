/**
 * Producer Service
 * 
 * Maneja toda la lógica específica de productores
 * Trabaja con producer_profiles y products
 * 
 * Responsabilidades:
 * - Gestión de perfil de productor
 * - CRUD de productos
 * - Estadísticas y métricas
 */

import { supabase } from '@/lib/supabase'

class ProducerService {
  /**
   * Crea el perfil de un nuevo productor
   * @param {string} userId - ID del usuario
   * @param {Object} profileData - Datos del perfil
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async createProfile(userId, profileData) {
    try {
      const { business_name, description, specialty, area, phone } = profileData

      if (!business_name || business_name.trim().length === 0) {
        throw new Error('El nombre del negocio es obligatorio')
      }

      const { data, error } = await supabase
        .from('producer_profiles')
        .insert({
          user_id: userId,
          business_name,
          description,
          specialty,
          area,
          phone,
          is_verified: false,
          rating: 0,
          total_sales: 0
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        profile: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene el perfil completo del productor
   * @param {string} userId - ID del usuario/productor
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('producer_profiles')
        .select(`
          *,
          users (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return {
        success: true,
        profile: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Actualiza el perfil del productor
   * @param {string} userId - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('producer_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        profile: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene todos los productos del productor
   * @param {string} userId - ID del productor
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<{success: boolean, products: Array, error: string}>}
   */
  async getProducts(userId, options = {}) {
    try {
      const { includeInactive = false, limit = 50, offset = 0 } = options

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('producer_id', userId)

      if (!includeInactive) {
        query = query.eq('is_active', true)
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
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
   * Obtiene órdenes recientes del productor
   * @param {string} userId - ID del productor
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<{success: boolean, orders: Array, error: string}>}
   */
  async getOrders(userId, options = {}) {
    try {
      const { status = null, limit = 20, offset = 0 } = options

      let query = supabase
        .from('orders')
        .select(`
          *,
          products (name, price),
          consumer: users!orders_consumer_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('producer_id', userId)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        success: true,
        orders: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene estadísticas del productor
   * @param {string} userId - ID del productor
   * @returns {Promise<{success: boolean, stats: Object, error: string}>}
   */
  async getStats(userId) {
    try {
      // Obtener perfil para datos básicos
      const profileResult = await this.getProfile(userId)
      if (!profileResult.success) throw new Error(profileResult.error)

      // Contar productos activos
      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('producer_id', userId)
        .eq('is_active', true)

      // Contar órdenes completadas este mes
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: ordersThisMonth } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('producer_id', userId)
        .eq('status', 'completed')
        .gte('created_at', startOfMonth.toISOString())

      return {
        success: true,
        stats: {
          totalSales: profileResult.profile.total_sales,
          rating: profileResult.profile.rating,
          activeProducts: activeProducts || 0,
          ordersThisMonth: ordersThisMonth || 0,
          isVerified: profileResult.profile.is_verified
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Busca productores por criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Promise<{success: boolean, producers: Array, error: string}>}
   */
  async search(criteria = {}) {
    try {
      const { specialty, area, onlyVerified = true, limit = 20, offset = 0 } = criteria

      let query = supabase
        .from('producer_profiles')
        .select(`
          *,
          users (
            id,
            email,
            full_name,
            avatar_url
          )
        `)

      if (onlyVerified) {
        query = query.eq('is_verified', true)
      }

      if (specialty) {
        query = query.eq('specialty', specialty)
      }

      if (area) {
        query = query.ilike('area', `%${area}%`)
      }

      const { data, error } = await query
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        success: true,
        producers: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const producerService = new ProducerService()
