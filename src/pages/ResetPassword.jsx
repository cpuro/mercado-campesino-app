import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '@/services/authService'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    // Verificar que hay token válido
    const verifySession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          setSessionError('Link de reset inválido o expirado. Por favor, solicita uno nuevo.')
          setValidSession(false)
        } else {
          setValidSession(true)
        }
      } catch (err) {
        setSessionError('Error verificando el link')
        setValidSession(false)
      }
    }

    verifySession()
  }, [])

  const validatePasswords = () => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validatePasswords()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="card w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-2">❌ Link Inválido</h1>
            <p className="text-gray-600">El link de reset ha expirado</p>
          </div>

          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {sessionError}
          </div>

          <div className="space-y-3 text-center text-sm">
            <p className="text-gray-600">
              <Link to="/forgot-password" className="text-primary hover:underline font-semibold">
                Solicitar nuevo link de reset
              </Link>
            </p>
            <p className="text-gray-600">
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Volver a Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="card w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin">⏳</div>
            <p className="text-gray-600 mt-4">Verificando link...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">🔐 Nueva Contraseña</h1>
          <p className="text-gray-600">Elige una contraseña segura</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold mb-1">✅ Contraseña actualizada</p>
            <p className="text-sm">Redirigiendo a login...</p>
          </div>
        )}

        {error && !success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pr-10"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usa mayúsculas, minúsculas y números para mayor seguridad
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-base pr-10"
                  placeholder="Repite tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {password && confirmPassword && password === confirmPassword && (
              <p className="text-sm text-green-600">✅ Las contraseñas coinciden</p>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="btn-primary w-full"
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            <Link to="/login" className="text-primary hover:underline font-semibold">
              ← Volver a Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
