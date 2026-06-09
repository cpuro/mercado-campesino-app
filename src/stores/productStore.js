import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ products: data || [] })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      set({ error: error.message })
      return null
    } finally {
      set({ loading: false })
    }
  },

  addProduct: async (productData) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
      
      if (error) throw error
      set({ products: [data[0], ...get().products] })
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null })
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({ products: get().products.filter(p => p.id !== id) })
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  }
}))
