// Hook de React para manejar estado local y efectos secundarios
import { useEffect, useState } from 'react'

// Store global de productos (Zustand)
import { useProductStore } from '@/stores/productStore'

// Store de autenticación
import { useAuthStore } from '@/stores/authStore'

// Store de perfil del usuario
import { useProfileStore } from '@/stores/useProfileStore'

// Función que construye la URL pública de una imagen almacenada
import { getProductImageUrl } from '@/utils/storage'

// Función que abre WhatsApp con un mensaje prellenado
import { openWhatsApp } from '@/utils/whatsapp'

// Cliente para consultas relacionadas con usuarios
import { userClient } from '@/lib/supabase'

// Componente visual para mostrar alertas
import { Alert } from '@/components/ui'

// Componente principal del catálogo
export default function Catalog() {

  // Obtiene datos y funciones desde el store de productos
  const {
    products,      // Lista de productos disponibles
    loading,       // Estado de carga
    fetchProducts  // Función para consultar productos
  } = useProductStore()

  // Obtiene el usuario autenticado
  const { user } = useAuthStore()

  // Obtiene información del perfil del usuario
  const {
    profile,       // Datos del perfil
    fetchProfile   // Función para consultar perfil
  } = useProfileStore()

  // Estado para almacenar texto de búsqueda
  const [searchTerm, setSearchTerm] = useState('')

  // Estado para almacenar categoría seleccionada
  const [categoryFilter, setCategoryFilter] = useState('')

  // Estado que guarda teléfonos de productores
  // Ejemplo:
  // {
  //   "uuid1": "573001112233",
  //   "uuid2": "573002223344"
  // }
  const [producerPhones, setProducerPhones] = useState({})

  // Estado para mostrar alertas en pantalla
  const [alertState, setAlertState] = useState(null)

  /**
   * Se ejecuta una sola vez cuando carga el componente.
   * Consulta todos los productos disponibles.
   */
  useEffect(() => {
    fetchProducts()
  }, [])

  /**
   * Si hay usuario y el perfil cargado no corresponde a él
   * (no existe o es de otra cuenta), consulta su perfil.
   */
  useEffect(() => {
    if (user?.id && profile?.id !== user.id) {
      fetchProfile(user.id)
    }
  }, [user?.id, profile, fetchProfile])

  /**
   * Obtiene los teléfonos de los productores
   * asociados a los productos cargados.
   */
  useEffect(() => {

    const fetchProducerPhones = async () => {

      // Si no hay productos no realiza consulta
      if (products.length === 0) return

      // Obtiene IDs únicos de productores
      const producerIds = [
        ...new Set(
          products.map(p => p.producer_id)
        )
      ]

      try {

        // Consulta teléfonos en base de datos
        const data = await userClient.getPhonesByIds(producerIds)

        // Objeto para almacenar resultados
        const phonesMap = {}

        // Convierte array en objeto id => teléfono
        data?.forEach(u => {
          phonesMap[u.id] = u.phone
        })

        // Guarda resultado en estado
        setProducerPhones(phonesMap)

      } catch (error) {

        console.error(
          'Error fetching producer phones:',
          error
        )
      }
    }

    fetchProducerPhones()

  }, [products])

  /**
   * Filtra productos según:
   * - Texto buscado
   * - Categoría seleccionada
   * - Existencia de inventario
   */
  const filtered = products.filter(p => {

    // Coincidencia por nombre o descripción
    const matchesSearch =
      p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      (
        p.description &&
        p.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )

    // Coincidencia por categoría
    const matchesCategory =
      !categoryFilter ||
      p.category === categoryFilter

    // Solo devuelve productos que cumplen todo
    return (
      matchesSearch &&
      matchesCategory &&
      p.quantity
    )
  })

  /**
   * Maneja la acción de hacer pedido.
   * Abre WhatsApp del productor.
   */
  const handleOrder = (product) => {

    // Busca teléfono del productor
    const producerPhone =
      producerPhones[product.producer_id]

    // Si no existe teléfono muestra alerta
    if (!producerPhone) {

      setAlertState({
        type: 'warning',
        title: 'Contacto no disponible',
        message:
          'Lo sentimos, el productor aún no ha registrado su número de WhatsApp. Por favor, intenta con otro producto.'
      })

      return
    }

    // Datos del comprador
    const consumerData = {

      // Correo del usuario autenticado
      email: user?.email,

      // Nombre completo
      name: profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        : '',

      // Teléfono del comprador
      phone: profile?.phone
    }

    // Abre WhatsApp con mensaje prellenado
    openWhatsApp(
      producerPhone,
      {
        productName: product.name,
        quantity: 1,
        price: product.price,
        totalPrice: product.price
      },
      consumerData
    )
  }

  // Renderizado visual
  return (

    <div
      className="min-h-screen px-4 py-12 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/logos/fondo.png)'
      }}
    >

      {/* Capa blanca semitransparente sobre el fondo */}
      <div className="absolute inset-0 bg-white opacity-50"></div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">

        {/* Mostrar alerta si existe */}
        {alertState && (

          <div className="mb-6">

            <Alert
              type={alertState.type}
              title={alertState.title}
              message={alertState.message}

              // Cierra la alerta
              onClose={() =>
                setAlertState(null)
              }
            />

          </div>
        )}

        {/* Encabezado */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Catálogo de productos
          </h1>

          {/* Buscador y filtro */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            {/* Campo búsqueda */}
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="input-base flex-1"
            />

            {/* Selector de categoría */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="input-base md:w-48"
            >

              <option value="">
                Todas las categorías
              </option>

              <option value="aves">
                🐔 Aves
              </option>

              <option value="cerdos">
                🐷 Cerdos
              </option>

              <option value="bovinos">
                🐄 Bovinos
              </option>

              <option value="huevos">
                🥚 Huevos
              </option>

              <option value="lacteos">
                🥛 Lácteos
              </option>

              <option value="platano">
                🍌 Plátano
              </option>

              <option value="maiz">
                🌽 Maíz
              </option>

              <option value="yuca">
                🥔 Yuca/Ñame
              </option>

              <option value="pesca">
                🐟 Pesca
              </option>

              <option value="frutas">
                🍎 Frutas
              </option>

              <option value="otros">
                📦 Otros
              </option>

            </select>

          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (

          <div className="text-center py-12">
            <p className="text-gray-600">
              Cargando productos...
            </p>
          </div>

        ) : filtered.length === 0 ? (

          /* Sin resultados */
          <div className="card text-center py-12">
            <p className="text-gray-600">
              No hay productos disponibles en esta búsqueda
            </p>
          </div>

        ) : (

          /* Listado de productos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {filtered.map(product => (

              <div
                key={product.id}
                className="card hover:shadow-md"
              >

                {/* Imagen del producto */}
                {product.image_path && (

                  <img
                    src={getProductImageUrl(product.image_path)}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Nombre */}
                <h3 className="font-bold text-base mb-2">
                  {product.name}
                </h3>

                {/* Descripción */}
                {product.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Precio e inventario */}
                <div className="mb-4">

                  <p className="text-xl font-bold text-primary">
                    ${product.price}
                  </p>

                  <p className="text-xs text-gray-500">
                    Disponible: {product.quantity}
                  </p>

                </div>

                {/* Botón pedido */}
                <button
                  onClick={() => handleOrder(product)}
                  className="btn-secondary w-full"
                >
                  📱 Hacer pedido por WhatsApp
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

/* 
Resumen de las variables principales
Variable -------------------	Propósito
products -------------------	Lista completa de productos
loading  -------------------	Indica si los productos se están cargando
fetchProducts()-------------	Consulta los productos desde Supabase
user -----------------------	Usuario autenticado
profile --------------------	Información adicional del usuario
fetchProfile()--------------	Consulta el perfil del usuario
searchTerm------------------	Texto ingresado en el buscador
categoryFilter--------------	Categoría seleccionada
producerPhones--------------	Mapa de productor → teléfono
alertState------------------	Configuración de la alerta mostrada
filtered--------------------	Productos filtrados por búsqueda, categoría e inventario
handleOrder()---------------	Inicia el pedido por WhatsApp
fetchProducerPhones()-------	Consulta teléfonos de productores

Arquitectónicamente, este componente realiza 4 funciones principales:

Carga productos.
Carga información del usuario.
Obtiene teléfonos de productores.
Permite buscar, filtrar y contactar al productor mediante WhatsApp.
*/