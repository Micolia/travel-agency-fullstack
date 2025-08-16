import FormRegister from '../components/Form/Form_Register'
import Footer from '../components/Footer/Footer'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Navigate } from 'react-router-dom'

const RegisterPage = () => {
  const { token } = useContext(UserContext)

  if (token) {
    return <Navigate to='/' replace />
  }
  return (
    <>
      <FormRegister />
      <Footer />
    </>
  )
}

export default RegisterPage
