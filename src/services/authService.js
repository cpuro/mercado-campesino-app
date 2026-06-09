/**
 * Authentication Service
 * 
 * Maneja toda la lógica de autenticación
 * Separada de UI y state management
 * 
 * Responsabilidades:
 * - Sign up / Sign in / Sign out
 * - Validación de credenciales
 * - Gestión de sesiones
 * - Obtener datos del usuario
 */

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

class AuthService {
  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {string} role - Rol: 'admin' | 'producer' | 'consumer'
   * @returns {Promise<{success: boolean, user: Object, error: string}>}
   */
  async signUp(email, password, role = 'consumer') {
    try {
      if (!this.validateEmail(email)) {
        throw new Error('Email inválido')
      }
      if (!this.validatePassword(password)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      })

      if (error) throw error

      return {
        success: true,
        user: data.user,
        message: 'Verificá tu email para confirmar la cuenta'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user: Object, role: string, token: string, error: string}>}
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const user = data.user
      const role = await resolveUserRole(user)
      const token = data.session?.access_token

      return {
        success: true,
        user,
        role,
        token
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Cierra la sesión actual
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
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
   * Obtiene la sesión actual
   * @returns {Promise<{session: Object, user: Object, role: string}>}
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (session?.user) {
        return {
          session,
          user: session.user,
          role: await resolveUserRole(session.user)
        }
      }

      return { session: null, user: null, role: null }
    } catch (error) {
      console.error('Error obteniendo sesión:', error.message)
      return { session: null, user: null, role: null }
    }
  }

  /**
   * Reinicia contraseña
   * @param {string} email 
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return {
        success: true,
        message: 'Revisa tu email para instrucciones de reinicio'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Valida que el email tenga formato correcto
   * @private
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida que la contraseña cumpla requisitos mínimos
   * @private
   */
  validatePassword(password) {
    return password && password.length >= 8
  }
}

export const authService = new AuthService()
