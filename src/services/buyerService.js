/**
 * Buyer Service
 * 
 * Maneja toda la lógica específica de compradores
 * Trabaja con buyer_profiles y orders
 * 
 * Responsabilidades:
 * - Gestión de perfil de comprador
 * - Gestión de favoritos
 * - Historial de compras
 */

import { supabase } from '@/lib/supabase'

class BuyerService {
  /**
   * Crea el perfil de un nuevo comprador
   * @param {string} userId - ID del usuario
   * @param {Object} profileData - Datos iniciales (opcional)
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async createProfile(userId, profileData = {}) {
    try {
      const { data, error } = await supabase
        .from('buyer_profiles')
        .insert({
          user_id: userId,
          preferred_categories: profileData.preferred_categories || [],
          dietary_preferences: profileData.dietary_preferences || null,
          notifications_enabled: true,
          email_alerts: true,
          total_purchases: 0,
          favorite_producers: []
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
   * Obtiene el perfil del comprador
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('*')
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
   * Actualiza el perfil del comprador
   * @param {string} userId - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<{success: boolean, profile: Object, error: string}>}
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('buyer_profiles')
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
   * Agrega un productor a favoritos
   * @param {string} userId - ID del comprador
   * @param {string} producerId - ID del productor
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async addFavoriteProducer(userId, producerId) {
    try {
      const profile = await this.getProfile(userId)
      if (!profile.success) throw new Error(profile.error)

      const favorites = profile.profile.favorite_producers || []

      // No agregar duplicados
      if (favorites.includes(producerId)) {
        return { success: true }
      }

      const updated = [...favorites, producerId]

      const result = await this.updateProfile(userId, {
        favorite_producers: updated
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Elimina un productor de favoritos
   * @param {string} userId - ID del comprador
   * @param {string} producerId - ID del productor
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async removeFavoriteProducer(userId, producerId) {
    try {
      const profile = await this.getProfile(userId)
      if (!profile.success) throw new Error(profile.error)

      const favorites = (profile.profile.favorite_producers || [])
        .filter(id => id !== producerId)

      const result = await this.updateProfile(userId, {
        favorite_producers: favorites
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Obtiene los productores favoritos del comprador
   * @param {string} userId - ID del comprador
   * @returns {Promise<{success: boolean, producers: Array, error: string}>}
   */
  async getFavoriteProducers(userId) {
    try {
      const profile = await this.getProfile(userId)
      if (!profile.success) throw new Error(profile.error)

      if (!profile.profile.favorite_producers?.length) {
        return {
          success: true,
          producers: []
        }
      }

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
        .in('user_id', profile.profile.favorite_producers)

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

  /**
   * Obtiene el historial de compras del comprador
   * @param {string} userId - ID del comprador
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<{success: boolean, orders: Array, error: string}>}
   */
  async getPurchaseHistory(userId, options = {}) {
    try {
      const { status = null, limit = 20, offset = 0 } = options

      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            price,
            image_url,
            producer: producer_profiles (
              business_name
            )
          )
        `)
        .eq('consumer_id', userId)

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
   * Obtiene recomendaciones de productos para el comprador
   * Basado en sus categorías preferidas
   * @param {string} userId - ID del comprador
   * @param {number} limit - Límite de resultados
   * @returns {Promise<{success: boolean, products: Array, error: string}>}
   */
  async getRecommendedProducts(userId, limit = 10) {
    try {
      const profile = await this.getProfile(userId)
      if (!profile.success) throw new Error(profile.error)

      const preferredCategories = profile.profile.preferred_categories || []

      let query = supabase
        .from('products')
        .select(`
          *,
          producer_profiles (
            business_name,
            rating
          )
        `)
        .eq('is_active', true)

      if (preferredCategories.length > 0) {
        query = query.in('category', preferredCategories)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit)

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
   * Obtiene estadísticas del comprador
   * @param {string} userId - ID del comprador
   * @returns {Promise<{success: boolean, stats: Object, error: string}>}
   */
  async getStats(userId) {
    try {
      const profile = await this.getProfile(userId)
      if (!profile.success) throw new Error(profile.error)

      // Contar órdenes completadas
      const { count: completedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('consumer_id', userId)
        .eq('status', 'completed')

      // Gasto total
      const { data: orders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('consumer_id', userId)
        .eq('status', 'completed')

      const totalSpent = (orders || [])
        .reduce((sum, order) => sum + (order.total_price || 0), 0)

      return {
        success: true,
        stats: {
          totalPurchases: profile.profile.total_purchases,
          completedOrders: completedOrders || 0,
          totalSpent: totalSpent,
          favoritProducersCount: (profile.profile.favorite_producers || []).length,
          preferredCategories: profile.profile.preferred_categories || []
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const buyerService = new BuyerService()
