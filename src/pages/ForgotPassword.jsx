// Hook de React para manejar estado local
import { useState } from 'react'

// Link para navegación y hook para redirigir
import { Link, useNavigate } from 'react-router-dom'

// Servicio de autenticación (incluye el reset de contraseña)
import { authService } from '@/services/authService'

// Componente para solicitar el restablecimiento de contraseña
export default function ForgotPassword() {

  // Función para redirigir entre páginas
  const navigate = useNavigate()

  // Email ingresado por el usuario
  const [email, setEmail] = useState('')

  // Indica si la solicitud se está enviando
  const [loading, setLoading] = useState(false)

  // Mensaje de éxito
  const [message, setMessage] = useState('')

  // Mensaje de error
  const [error, setError] = useState('')

  // True cuando el correo de reset ya se envió
  const [sent, setSent] = useState(false)

  /**
   * Solicita el correo de restablecimiento de contraseña.
   * Si tiene éxito, muestra el mensaje de "email enviado".
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Envía el correo con el enlace de reset (vía Supabase)
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
      // Siempre desactiva el indicador de carga
      setLoading(false)
    }
  }

  // Renderizado visual
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">

        {/* Encabezado (cambia según si ya se envió el correo) */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">🔐 Recuperar Contraseña</h1>
          <p className="text-gray-600">
            {sent ? 'Verifica tu email' : 'Te enviaremos un link para resetear tu contraseña'}
          </p>
        </div>

        {/* Antes de enviar: formulario; después: confirmación */}
        {!sent ? (
          <>
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Formulario de solicitud */}
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

              {/* Botón de envío (deshabilitado si no hay email o está cargando) */}
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
          /* Confirmación de envío */
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

        {/* Enlaces de navegación */}
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

/*
Resumen de las variables principales
Variable -------------------	Propósito
navigate() -----------------	Redirige entre páginas
email ----------------------	Email ingresado por el usuario
loading --------------------	Indica si la solicitud se está enviando
message --------------------	Mensaje de éxito
error ----------------------	Mensaje de error
sent -----------------------	True cuando el correo de reset ya se envió
handleSubmit() -------------	Solicita el correo de restablecimiento
authService.resetPassword()-	Envía el correo de reset (vía Supabase)

Este componente solicita el restablecimiento de contraseña: el usuario
ingresa su email y recibe un correo con un enlace que lo lleva a la página
/reset-password, donde define su nueva contraseña.
*/
