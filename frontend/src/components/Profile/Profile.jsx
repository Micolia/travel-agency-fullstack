import './profile.css'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { userData, logout, token, getProfile } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login') // si no está logueado, enviar a login
    } else {
      getProfile()
    }
  }, [token, navigate, getProfile])

  const handleLogout = () => {
    logout()
    navigate('/login') // enviar a login después de logout
  }

  if (!userData) {
    return <p>Loading...</p>
  }

  // Formatear fecha de nacimiento
  const formattedBirth = userData.date_of_birth
    ? new Date(userData.date_of_birth).toLocaleDateString('es-CL')
    : 'No registrada'

  return (
    <div className='create-package-container'>
      <div className='create-package-header'>
        <h1>👤 Mi Perfil</h1>
        <p>Gestiona tu cuenta de viajero</p>
      </div>

      <div className='package-form'>
        <div className='form-section'>
          <h2>📝 Información Personal</h2>
          <div className='form-row'>
            <div className='form-group'>
              <label>Nombre</label>
              <div className='form-display-value'>{userData.nombre || 'No registrado'}</div>
            </div>
            <div className='form-group'>
              <label>Apellido</label>
              <div className='form-display-value'>{userData.appellido || 'No registrado'}</div>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Fecha de Nacimiento</label>
              <div className='form-display-value'>{formattedBirth}</div>
            </div>
            <div className='form-group'>
              <label>Teléfono</label>
              <div className='form-display-value'>{userData.phone || 'No registrado'}</div>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Tipo de Usuario</label>
              <div className='form-display-value'>{userData.user_type}</div>
            </div>
          </div>
        </div>

        <div className='form-section'>
          <h2>📧 Información de Cuenta</h2>
          <div className='form-row'>
            <div className='form-group'>
              <label>Email</label>
              <div className='form-display-value'>{userData.email}</div>
            </div>
          </div>
        </div>

        <div className='form-actions'>
          <button className='btn-create-package logout-btn' onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
