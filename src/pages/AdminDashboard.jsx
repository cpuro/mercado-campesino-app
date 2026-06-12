// Hooks de React
import { useEffect, useState } from 'react'

// Store global de autenticación
import { useAuthStore } from '@/stores/authStore'

// Cliente de Supabase para consultas a la base de datos
import { supabase } from '@/lib/supabase'

// Componente principal del panel administrativo
export default function AdminDashboard() {

  // Obtiene el usuario actualmente autenticado
  const { user } = useAuthStore()

  /**
   * Lista de productores pendientes de validación.
   *
   * Ejemplo:
   * [
   *   {
   *     id: '123',
   *     first_name: 'Juan',
   *     last_name: 'Pérez'
   *   }
   * ]
   */
  const [pendingProducers, setPendingProducers] = useState([])

  /**
   * Estadísticas generales del sistema.
   */
  const [stats, setStats] = useState({

    // Total de usuarios registrados
    totalUsers: 0,

    // Total de productores
    totalProducers: 0,

    // Total de consumidores
    totalConsumers: 0
  })

  /**
   * Controla el estado de carga.
   *
   * true  = cargando datos
   * false = datos cargados
   */
  const [loading, setLoading] = useState(true)

  /**
   * Se ejecuta una única vez cuando se monta el componente.
   */
  useEffect(() => {
    fetchDashboardData()
  }, [])

  /**
   * Consulta toda la información necesaria
   * para construir el dashboard.
   */
  async function fetchDashboardData() {

    // Activa indicador de carga
    setLoading(true)

    try {

      /**
       * Consulta todos los usuarios de la tabla users
       */
      const {
        data: allUsers,
        error
      } = await supabase
        .from('users')
        .select(
          `
          id,
          email,
          first_name,
          last_name,
          phone,
          role,
          avatar_url,
          created_at
          `
        )

      // Si Supabase devuelve error se lanza excepción
      if (error) throw error

      /**
       * Filtra únicamente usuarios
       * con rol de productor.
       */
      const producers =
        allUsers.filter(
          u => u.role === 'producer'
        )

      /**
       * Filtra únicamente usuarios
       * con rol de consumidor.
       */
      const consumers =
        allUsers.filter(
          u => u.role === 'consumer'
        )

      /**
       * Determina productores pendientes.
       *
       * En este caso:
       * Productor sin teléfono registrado.
       */
      const pending =
        producers.filter(
          u => !u.phone
        )

      /**
       * Guarda productores pendientes.
       *
       * Actualmente está comentado,
       * por lo que NO se muestran.
       */
      // setPendingProducers(pending)

      /**
       * Actualiza estadísticas del dashboard.
       */
      setStats({

        // Total usuarios registrados
        totalUsers: allUsers.length,

        // Total productores
        totalProducers: producers.length,

        // Total consumidores
        totalConsumers: consumers.length
      })

    } catch (err) {

      /**
       * Muestra error en consola.
       */
      console.error(
        'Error cargando datos:',
        err.message
      )

    } finally {

      /**
       * Finaliza estado de carga
       * independientemente de si hubo error.
       */
      setLoading(false)
    }
  }

  /**
   * Renderizado visual del componente.
   */
  return (

    <div className="max-w-6xl mx-auto p-4">

      {/* Encabezado */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administrador
        </h1>

        <p className="text-gray-600">

          {/* Muestra correo del administrador */}
          Bienvenido, {user?.email}

        </p>

      </div>

      {/* Mientras carga datos */}
      {loading ? (

        <p className="text-gray-500">
          Cargando...
        </p>

      ) : (

        <>
          {/* ========================= */}
          {/* TARJETAS DE ESTADÍSTICAS */}
          {/* ========================= */}

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* Total usuarios */}
            <div className="card">

              <h3 className="text-sm text-gray-600 mb-2">
                Total de usuarios
              </h3>

              <p className="text-3xl font-bold text-primary">
                {stats.totalUsers}
              </p>

            </div>

            {/* Total productores */}
            <div className="card">

              <h3 className="text-sm text-gray-600 mb-2">
                Productores
              </h3>

              <p className="text-3xl font-bold text-secondary">
                {stats.totalProducers}
              </p>

            </div>

            {/* Total consumidores */}
            <div className="card">

              <h3 className="text-sm text-gray-600 mb-2">
                Consumidores
              </h3>

              <p className="text-3xl font-bold text-accent">
                {stats.totalConsumers}
              </p>

            </div>

          </div>

          {/* ========================= */}
          {/* PRODUCTORES PENDIENTES */}
          {/* ========================= */}

          <div className="card">

            <h2 className="text-xl font-bold mb-4">
              Validar nuevos productores
            </h2>

            {/* Si no existen productores pendientes */}
            {pendingProducers.length === 0 ? (

              <p className="text-gray-600 text-center py-12">

                No hay productores pendientes de validación

              </p>

            ) : (

              <ul className="divide-y">

                {/* Recorre cada productor */}
                {pendingProducers.map(producer => (

                  <li
                    key={producer.id}
                    className="flex items-center justify-between py-3"
                  >

                    <div className="flex items-center gap-3">

                      {/* Si tiene foto */}
                      {producer.avatar_url ? (

                        <img
                          src={producer.avatar_url}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />

                      ) : (

                        /**
                         * Si no tiene foto,
                         * muestra las iniciales.
                         */
                        <div
                          className="
                            w-9
                            h-9
                            rounded-full
                            bg-gray-200
                            flex
                            items-center
                            justify-center
                            text-sm
                            font-medium
                            text-gray-600
                          "
                        >

                          {producer.first_name?.[0]}
                          {producer.last_name?.[0]}

                        </div>

                      )}

                      {/* Información del productor */}
                      <div>

                        <p className="font-medium">

                          {producer.first_name}
                          {' '}
                          {producer.last_name}

                        </p>

                        <p className="text-sm text-gray-500">

                          {producer.email}

                        </p>

                      </div>

                    </div>

                  </li>

                ))}

              </ul>

            )}

          </div>

        </>

      )}

    </div>
  )
}

/*
Resumen de las variables principales
Variable -------------------	Propósito
user -----------------------	Usuario autenticado (administrador)
pendingProducers------------	Productores pendientes de validación
stats ----------------------	Estadísticas: totalUsers, totalProducers y totalConsumers
loading --------------------	Indica si los datos se están cargando
fetchDashboardData()--------	Consulta los usuarios y calcula las estadísticas
producers-------------------	Usuarios con rol productor (uso interno)
consumers-------------------	Usuarios con rol consumidor (uso interno)
pending --------------------	Productores sin teléfono registrado (uso interno)

Arquitectónicamente, este componente realiza 3 funciones principales:

Consulta todos los usuarios desde Supabase.
Calcula las estadísticas (usuarios, productores y consumidores).
Lista los productores pendientes de validación (sección actualmente desactivada).
*/