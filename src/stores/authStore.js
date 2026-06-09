import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const resolveUserRole = async (user) => {
  const metadataRole = user?.user_metadata?.role || 'consumer'

  if (metadataRole === 'admin') {
    return 'admin'
  }

  if (!user?.id) {
    return metadataRole
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data?.role || metadataRole
  } catch {
    return metadataRole
  }
}

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setError: (error) => set({ error }),

  signUp: async (email, password, role) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      })
      if (error) throw error
      set({ user: data.user, role })
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      const userRole = await resolveUserRole(data.user)
      set({ user: data.user, role: userRole })
      return { success: true, role: userRole }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, role: null })
    } catch (error) {
      set({ error: error.message })
    }
  },

  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userRole = await resolveUserRole(session.user)
        set({ user: session.user, role: userRole })
      }
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  }
}))
