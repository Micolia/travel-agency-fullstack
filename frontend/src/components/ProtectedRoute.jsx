import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, isAdmin } = useContext(UserContext)

  if (!token) {
    return <Navigate to="/login" />
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
