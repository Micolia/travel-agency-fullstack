import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { CartContext } from '../../context/CartContext'

const Navbar = () => {
  const { token, logout, isOrganizer, isAdmin } = useContext(UserContext)
  const { getCartItemsCount, toggleCart } = useContext(CartContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const canCreatePackages = () => isOrganizer() || isAdmin()

  return (
    <div className='navigazione'>
      <div className='bttleft'>
        <Link to='/'><button className='btnfill'>🏠 Inicio</button></Link>
        {token
          ? (
            <>
              <Link to='/profile'><button className='btnempty'>👤 Perfil</button></Link>
              <Link to='/community'><button className='btnempty'>🌐 Comunidad</button></Link>
              <Link to='/my-trips'><button className='btnempty'>📅 Mis viajes</button></Link>
              {canCreatePackages() && (
                <Link to='/create-package'><button className='btnempty'>📦 Crear Paquete</button></Link>
              )}
              {isAdmin() && (
                <Link to='/admin'><button className='btnempty'>🛠 Admin Dashboard</button></Link>
              )}
              <button className='btnempty' onClick={handleLogout}>🚪 Cerrar sesión</button>
            </>
          )
          : (
            <>
              <Link to='/login'><button className='btnempty'>🔐 Iniciar sesión</button></Link>
              <Link to='/register'><button className='btnempty'>📝 Registrarse</button></Link>
            </>
          )}
      </div>
      <div className='bttright'>
        <button
          className='btnempty'
          onClick={toggleCart}
        >
          🛒 Carrito {getCartItemsCount() > 0 && <span className='cart-badge'>{getCartItemsCount()}</span>}
        </button>
        <Link to='/packages'><button className='btnfill'>🧳 Explorar Paquetes</button></Link>
      </div>
    </div>
  )
}

export default Navbar
