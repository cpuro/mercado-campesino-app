import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, phone, avatar_url, role')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      set({ profile: data, loading: false })
    } catch (err) {
      console.error('Error fetching profile:', err)
      set({ error: err.message, loading: false })
    }
  },

  updateProfile: async (userId, updates) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, first_name, last_name, phone, avatar_url, role')
        .single()

      if (error) {
        throw error
      }

      set({ profile: data, loading: false })
      return { success: true }
    } catch (err) {
      console.error('Error updating profile:', err)
      set({ error: err.message, loading: false })
      return { success: false, error: err.message }
    }
  },

  clearError: () => set({ error: null })
}))
