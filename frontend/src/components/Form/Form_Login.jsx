import './form.css'
import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const FormLogin = () => {
  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError('Debes ingresar todos los datos')
      return
    }

    if (loginData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await login(loginData.email, loginData.password)
      navigate('/')
    } catch (error) {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div className='create-package-container'>
      <div className='create-package-header'>
        <h1>🔐 Iniciar Sesión</h1>
        <p>Bienvenido de vuelta, viajero</p>
      </div>

      <div className='package-form'>
        {error && <div className='error-message'>{error}</div>}

        <div className='form-section'>
          <h2>👤 Acceso a tu cuenta</h2>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                placeholder='tu@email.com'
                value={loginData.email}
                onChange={handleChange}
                name='email'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Contraseña</label>
              <input
                id='password'
                type='password'
                placeholder='Tu contraseña'
                value={loginData.password}
                onChange={handleChange}
                name='password'
              />
            </div>
          </div>
        </div>

        <div className='form-actions'>
          <button className='btn-create-package' onClick={handleLogin}>
            🚀 Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormLogin
