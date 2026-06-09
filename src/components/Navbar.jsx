import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import ProfileDropdown from '@/components/navbar/ProfileDropdown'
import LOGOMERCADOCAMPESIN from '/logos/LOGOMERCADOCAMPESINO.png';

export default function Navbar() {
  const { user, role, signOut } = useAuthStore()
  const location = useLocation()

  const handleLogout = () => {
    signOut()
  }

  const isActive = (path) => location.pathname === path ? 'text-primary border-b-2 border-primary' : ''

  return (
    <nav className="bg-green-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary">
          <img src={LOGOMERCADOCAMPESIN} alt="Mercado Campesino" className="h-20 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <div className="hidden md:flex gap-6 text-white">
                <Link to="/catalog" className={`hover:text-primary ${isActive('/catalog')}`}>
                  Catálogo
                </Link>
                {role === 'producer' && (
                  <Link to="/producer" className={`hover:text-primary ${isActive('/producer')}`}>
                    Mis productos
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className={`hover:text-primary ${isActive('/admin')}`}>
                    Administración
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                <ProfileDropdown />
                <button
                  onClick={handleLogout}
                  className="btn-ghost py-1"
                >
                  Salir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
