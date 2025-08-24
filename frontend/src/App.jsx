import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import ProfilePage from './views/ProfilePage'
import CommunityPage from './views/CommunityPage'
import MyTripsPage from './views/MyTripsPage'
import PackageDetailPage from './views/PackageDetailPage'
import PackagesPage from './views/PackagesPage'
import CreatePackagePage from './views/CreatePackagePage'
import CartPage from './components/Cart/CartPage'
import NotFoundPage from './views/NotFoundPage'
import UserProvider from './context/UserContext'
import CartProvider from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './components/Cart/Cart'
import AdminDashboard from './views/AdminDashboard'


import './app.css'

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Cart />
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/packages' element={<PackagesPage />} />
            <Route path='/package/:id' element={<PackageDetailPage />} />
            <Route path='/cart' element={<CartPage />} />

            {/* Private routes */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path='/community'
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />

            <Route
              path='/my-trips'
              element={
                <ProtectedRoute>
                  <MyTripsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path='/create-package'
              element={
                <ProtectedRoute>
                  <CreatePackagePage />
                </ProtectedRoute>
              }
            />

            {/* Admin route */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path='*' element={<NotFoundPage />} />
            <Route path='/404' element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  )
}

export default App
