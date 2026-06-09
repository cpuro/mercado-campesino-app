import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { GiSeedling } from "react-icons/gi";
import { ImUserCheck } from "react-icons/im";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { PiWhatsappLogo } from "react-icons/pi";
import { SiBuymeacoffee } from "react-icons/si";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { MdUpdate } from "react-icons/md";
import { BsBroadcastPin } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { SiFresh } from "react-icons/si";
import { FaBalanceScale } from "react-icons/fa";
import { FaRoute } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { MdOutlinePhonelinkRing } from "react-icons/md";

export default function Home() {
  const { user, role } = useAuthStore()

  if (user) {
    return (
      <div className="min-h-screen px-4 py-12 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/logos/fondo.png)' }}>
        <div className="absolute inset-0 bg-white opacity-50"></div>
        <div className="max-w-7xl mx-auto p-4 relative z-10">
          <img src="/logos/LOGOMERCADOCAMPESINO.png" alt="Mercado Campesino Digital" 
          className="h-[182px] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mercado Campesino Digital
          </h1>
          <p className="text-xl text-gray-600 mb-8">  
            Conecta directamente productores rurales con consumidores urbanos
          </p>

          {role === 'producer' ? (
            <div className="flex justify-center gap-4">
              <Link to="/producer" className="btn-primary text-lg px-8 py-3">
                📦 Mi panel de productor
              </Link>
              <Link to="/catalog" className="btn-secondary text-lg px-8 py-3">
                🛍️ Ver catálogo
              </Link>
            </div>
          ) : role === 'admin' ? (
            <Link to="/admin" className="btn-primary text-lg px-8 py-3">
              ⚙️ Panel de administrador
            </Link>
          ) : (
            <Link to="/catalog" className="btn-secondary text-lg px-8 py-3">
              🛍️ Explorar productos
            </Link>
          )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
             <GiSeedling className="text-5xl mb-4 mx-auto text-green-500" />
            <h3 className="font-bold text-lg mb-2">Para Productores</h3>
            <p className="text-gray-600">Publica tus productos y llega directamente a consumidores urbanos sin intermediarios</p>
          </div>
          <div className="card text-center">
            <GiMeal className="text-5xl mb-4 mx-auto text-green-500" />
            <h3 className="font-bold text-lg mb-2">Para Consumidores</h3>
            <p className="text-gray-600">Compra productos frescos directamente de productores locales a través de WhatsApp</p>
          </div>
          <div className="card text-center">
            <MdOutlinePhonelinkRing className="text-5xl mb-4 mx-auto text-green-500" />
            <h3 className="font-bold text-lg mb-2">Fácil de usar</h3>
            <p className="text-gray-600">Funciona en cualquier dispositivo como una app, sin necesidad de instalar nada</p>
          </div>
        </div>
      </div>
    </div>
  )
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/logos/fondo.png)' }}>
      <div className="absolute inset-0 bg-white opacity-50"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <img src="/logos/LOGOMERCADOCAMPESINO.png" alt="Mercado Campesino Digital" className="h-[182px] mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Mercado Campesino Digital 
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          Conectamos productores rurales con consumidores urbanos
        </p>
        <p className="text-lg text-gray-600 mb-12">
          Vende directamente. Sin intermediarios. Sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Inicia sesión
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">
            Regístrate
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <GiSeedling className="text-5xl mb-4 mx-auto text-green-500"/>
            <h3 className="font-bold text-xl mb-3">Para Productores</h3>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <ImUserCheck className="text-2xl  text-green-500" /> Registro sencillo
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <MdOutlineProductionQuantityLimits className="text-2xl  text-green-500" /> Carga fácil de productos
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <BiSolidOffer className="text-2xl  text-green-500" /> Publicar oferta al instante
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <PiWhatsappLogo className="text-2xl  text-green-500" /> Recibir pedidos por WhatsApp
              </li>
            </ul>
          </div>

          <div className="card">
            <SiBuymeacoffee className="text-5xl mb-4 mx-auto text-green-500"/>
            <h3 className="font-bold text-xl mb-3">Para Consumidores</h3>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <BsBroadcastPin className="text-2xl  text-green-500" /> Catálogo en tiempo real
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <MdLocalOffer className="text-2xl  text-green-500" /> Ofertas nuevas diarias
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <PiWhatsappLogo className="text-2xl  text-green-500" /> Haz tu pedido por WhatsApp
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <SiFresh className="text-2xl  text-green-500" /> Productos frescos y locales
              </li>
            </ul>
          </div>

          <div className="card">
            <MdUpdate className="text-5xl mb-4 mx-auto text-green-500"/>
            <h3 className="font-bold text-xl mb-3">Sin intermediarios</h3>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaBalanceScale className="text-2xl  text-green-500" /> Precio justo
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <BsBroadcastPin className="text-2xl  text-green-500" /> Contacto directo
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaRoute className="text-2xl  text-green-500" /> Trazabilidad
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <FaMapMarkerAlt className="text-2xl  text-green-500" /> Apoyo a lo local
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
