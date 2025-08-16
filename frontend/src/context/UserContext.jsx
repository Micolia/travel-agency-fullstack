import { createContext, useState } from 'react'

export const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [userType, setUserType] = useState(null) // 'traveler' o 'organizer'
  const [userData, setUserData] = useState(null)

  // login
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) throw new Error('Credenciales no válidas')

      const data = await res.json()
      setToken(data.token)
      setEmail(data.user.email)
      setUserType(data.user.user_type)
      setUserData(data.user)
      console.log('Login realizado con éxito!')
    } catch (error) {
      console.error('Error durante el login:', error.message)
      throw error
    }
  }

  // register new user
  const register = async ({ nombre, appellido, nacimiento, email, password, phone, userType = 'traveler' }) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, appellido, nacimiento, email, password, phone, userType })
      })

      if (!res.ok) throw new Error('Error en la registración')

      const data = await res.json()
      // actualizar estado con datos del usuario registrado
      setToken(data.token)
      setEmail(data.user.email)
      setUserType(data.user.user_type)
      setUserData(data.user)
      console.log('Registro completado con éxito!')
    } catch (error) {
      console.error('Error durante la registración:', error.message)
      throw error
    }
  }

  // profile logged user
  const getProfile = async () => {
    if (!token) return

    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      })

    if (!res.ok) throw new Error('Error al obtener perfil')

    const data = await res.json()
    setUserData(data)      // guarda todo el objeto
    setEmail(data.email)   // email separado si quieres
    setUserType(data.user_type)
    console.log('Perfil usuario:', data)
  } catch (error) {
      console.error('Error al obtener perfil:', error.message)
  }
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    setUserType(null)
    setUserData(null)
    console.log('Logout realizado')
  }

  const isOrganizer = () => userType === 'organizer'

  const setTestOrganizer = () => {
    setToken('test-organizer-token')
    setEmail('organizer@test.com')
    setUserType('organizer')
    setUserData({ nombre: 'Test Organizer', email: 'organizer@test.com' })
  }

  return (
    <UserContext.Provider value={{
      token,
      email,
      userType,
      userData,
      login,
      register,
      logout,
      getProfile,
      isOrganizer,
      setTestOrganizer
    }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
