import FormLogin from '../components/Form/Form_Login'
import Footer from '../components/Footer/Footer'
import { UserContext } from '../context/UserContext'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'

const LoginPage = () => {
  const { token } = useContext(UserContext)

  if (token) {
    return <Navigate to='/' replace />
  }

  return (
    <div>
      <FormLogin />
      <Footer />
    </div>
  )
}

export default LoginPage
