import { createContext, useState } from 'react'
import { API_BASE_URL } from '../config'

export const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [userType, setUserType] = useState(null) // 'traveler', 'organizer', 'admin'
  const [userData, setUserData] = useState(null)
  const [usersList, setUsersList] = useState([]) // lista de usuarios (solo admin)
  const [packagesList, setPackagesList] = useState([]) // lista de paquetes (admin/organizer)

  const baseUrl = API_BASE_URL

  // --- Login ---
  const login = async (email, password) => {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
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

  // --- Registro ---
  const register = async ({ nombre, apellido, nacimiento, email, password, phone, userType: uType = 'traveler' }) => {
    const requestData = { nombre, apellido, nacimiento, email, password, phone, user_type: uType }
    console.log('=== FRONTEND - Datos a enviar ===', { ...requestData, password: '***' })
    try {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      if (!res.ok) throw new Error('Error en la registración')
      const data = await res.json()
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

  // --- Perfil del usuario logueado ---
  const getProfile = async () => {
    if (!token) return
    try {
      const res = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al obtener perfil')
      const data = await res.json()
      setUserData(data)
      setEmail(data.email)
      setUserType(data.user_type)
      console.log('Perfil usuario:', data)
    } catch (error) {
      console.error('Error al obtener perfil:', error.message)
    }
  }

  // --- Logout ---
  const logout = () => {
    setToken(null)
    setEmail(null)
    setUserType(null)
    setUserData(null)
    setUsersList([])
    setPackagesList([])
    console.log('Logout realizado')
  }

  // --- Helper roles ---
  const isOrganizer = () => userType === 'organizer'
  const isAdmin = () => userType === 'admin'

  // --- Funciones admin ---
  // --- Funciones admin ---
  const fetchUsers = async () => {
    if (!token || !isAdmin()) return
    try {
      const res = await fetch(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al obtener usuarios')
      const data = await res.json()

      // Normalizar los datos del backend
      const normalizedUsers = data.map(u => ({
        id: u.id,
        nombre: u.nombre || u.name || '',
        apellido: u.apellido || '',
        email: u.email,
        user_type: u.user_type || 'traveler'
      }))

      setUsersList(normalizedUsers) // solo una vez
      console.log('Usuarios cargados:', normalizedUsers)
    } catch (error) {
      console.error('Error al listar usuarios:', error.message)
    }
  }

  const deleteUserById = async (id) => {
    if (!token || !isAdmin()) return
    try {
      const res = await fetch(`${baseUrl}/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Error al eliminar usuario')
      setUsersList(usersList.filter(u => u.id !== id))
      console.log(`Usuario ${id} eliminado`)
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message)
    }
  }

  const updateUserById = async (id, data) => {
    if (!token || !isAdmin()) return

    try {
    // Construimos payload solo con campos válidos y obligatorios
      const payload = {
        email: data.email, // email siempre obligatorio
        name: [data.nombre, data.apellido].filter(Boolean).join(' ').trim() || data.name || '',
        user_type: data.user_type || 'traveler',
        phone: data.phone || null,
        date_of_birth: data.date_of_birth || null,
        profile_image: data.profile_image || null,
        is_active: data.is_active ?? true
      }

      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Error al actualizar usuario')
      }

      const updatedUser = await res.json()

      // Actualizamos localmente
      setUsersList(usersList.map(u => (u.id === id
        ? {
            id,
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email,
            user_type: data.user_type || 'traveler'
          }
        : u)))

      console.log(`Usuario ${id} actualizado`, updatedUser.user)
    } catch (error) {
      console.error('Error al actualizar usuario:', error.message)
    }
  }

  // --- Funciones paquetes (admin/organizer) ---
  const fetchPackages = async () => {
    if (!token || (!isAdmin() && !isOrganizer())) return
    try {
      const res = await fetch(`${baseUrl}/packages`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Error al obtener paquetes')
      const data = await res.json()
      setPackagesList(data)
      console.log('Paquetes cargados:', data)
    } catch (error) {
      console.error('Error al listar paquetes:', error.message)
    }
  }

  const createPackage = async (pkg) => {
    if (!token || (!isAdmin() && !isOrganizer())) return
    try {
      const res = await fetch(`${baseUrl}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(pkg)
      })
      if (!res.ok) throw new Error('Error al crear paquete')
      await fetchPackages()
      console.log('Paquete creado')
    } catch (error) {
      console.error(error)
    }
  }

  const updatePackage = async (id, pkg) => {
    if (!token || (!isAdmin() && !isOrganizer())) return
    try {
      const res = await fetch(`${baseUrl}/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(pkg)
      })
      if (!res.ok) throw new Error('Error al actualizar paquete')
      await fetchPackages()
      console.log(`Paquete ${id} actualizado`)
    } catch (error) {
      console.error(error)
    }
  }

  const deletePackage = async (id) => {
    if (!token || (!isAdmin() && !isOrganizer())) return
    try {
      const res = await fetch(`${baseUrl}/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al eliminar paquete')
      setPackagesList(packagesList.filter(p => p.id !== id))
      console.log(`Paquete ${id} eliminado`)
    } catch (error) {
      console.error(error)
    }
  }

  // --- Función de prueba para role organizer ---
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
      usersList,
      packagesList,
      login,
      register,
      getProfile,
      logout,
      isOrganizer,
      isAdmin,
      fetchUsers,
      deleteUserById,
      updateUserById,
      fetchPackages,
      createPackage,
      updatePackage,
      deletePackage,
      setTestOrganizer
    }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
