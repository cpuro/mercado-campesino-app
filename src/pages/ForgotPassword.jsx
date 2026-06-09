import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const result = await authService.resetPassword(email)

      if (result.success) {
        setSent(true)
        setMessage(result.message || 'Se envió un email con instrucciones para resetear tu contraseña')
      } else {
        setError(result.error || 'Error al solicitar el reset de contraseña')
      }
    } catch (err) {
      setError(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">🔐 Recuperar Contraseña</h1>
          <p className="text-gray-600">
            {sent ? 'Verifica tu email' : 'Te enviaremos un link para resetear tu contraseña'}
          </p>
        </div>

        {!sent ? (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base"
                  placeholder="tu@email.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el email asociado a tu cuenta
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full"
              >
                {loading ? 'Enviando...' : 'Enviar Email de Reset'}
              </button>
            </form>
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold mb-2">✅ Email enviado</p>
            <p className="text-sm">
              Verifica tu email <strong>{email}</strong> para obtener el link de reset.
            </p>
            <p className="text-sm mt-2">
              Si no ves el email, revisa la carpeta de spam.
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm space-y-3">
          <p className="text-gray-600">
            <Link to="/login" className="text-primary hover:underline font-semibold">
              ← Volver a Iniciar Sesión
            </Link>
          </p>
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
