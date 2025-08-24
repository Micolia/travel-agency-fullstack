import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { UserContext } from '../../context/UserContext'
import './cart.css'

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen
  } = useContext(CartContext)

  const { token } = useContext(UserContext)
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!token) {
      alert('Debes iniciar sesión para proceder con el pago')
      return
    }

    if (cartItems.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('http://localhost:5000/api/bookings/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cart_items: cartItems })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert(`🎉 ¡Reserva completada! 
      
${data.booking_count} reservas creadas
Total: €${data.total_amount}`)

        clearCart()
        setIsCartOpen(false)
        navigate('/my-trips')
      } else {
        alert(`❌ Error en el checkout: ${data.message || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error checkout:', error)
      alert('❌ Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!isCartOpen) return null

  return (
    <div className='cart-overlay'>
      <div className='cart-container'>
        <div className='cart-header'>
          <h2>🛒 Carrito de Reservas</h2>
          <button
            className='cart-close-btn'
            onClick={() => setIsCartOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className='cart-content'>
          {cartItems.length === 0
            ? (
              <div className='cart-empty'>
                <p>Tu carrito está vacío</p>
                <span>🧳</span>
              </div>
              )
            : (
              <>
                <div className='cart-items'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='cart-item'>
                      <div className='cart-item-details'>
                        <h4>{item.packageTitle}</h4>
                        <p className='cart-item-destination'>📍 {item.destination}</p>

                        <div className='cart-item-booking'>
                          <span>📅 {formatDate(item.bookingDetails.startDate)} - {formatDate(item.bookingDetails.endDate)}</span>
                          <span>👥 {item.bookingDetails.passengers} pasajeros</span>
                        </div>

                        <div className='cart-item-price'>
                          <strong>€{item.bookingDetails.totalPrice}</strong>
                        </div>
                      </div>

                      <button
                        className='cart-item-remove'
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className='cart-footer'>
                  <div className='cart-total'>
                    <h3>Total: €{getTotalPrice()}</h3>
                  </div>

                  <div className='cart-actions'>
                    <button
                      className='btn-view-cart'
                      onClick={() => {
                        navigate('/cart')
                        setIsCartOpen(false)
                      }}
                    >
                      👁️ Ver Carrito Completo
                    </button>

                    <button
                      className='btn-clear-cart'
                      onClick={clearCart}
                    >
                      Vaciar Carrito
                    </button>

                    <button
                      className='btn-checkout'
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0 || isProcessing}
                    >
                      {isProcessing ? '⏳ Procesando...' : '💳 Proceder al Pago'}
                    </button>
                  </div>
                </div>
              </>
              )}
        </div>
      </div>
    </div>
  )
}

export default Cart
