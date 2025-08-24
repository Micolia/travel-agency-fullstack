import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { UserContext } from '../../context/UserContext'
import './cartPage.css'
import { API_BASE_URL } from '../../config.js'

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useContext(CartContext)

  const { token } = useContext(UserContext)
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setIsProcessing(true)

    try {
      // Chiamata API per checkout
      const response = await fetch(`${API_BASE_URL}/bookings/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cart_items: cartItems
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Checkout riuscito
        alert(`🎉 ¡Reserva completada! 
        
${data.booking_count} reservas creadas
Total: €${data.total_amount}

Serás redirigido a tus reservas.`)

        clearCart() // Svuota il carrello
        navigate('/my-trips') // Vai alle prenotazioni
      } else {
        // Errore nel checkout
        alert(`❌ Error en el checkout: ${data.message || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Errore checkout:', error)
      alert('❌ Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}
    >
      <div style={{
        marginBottom: '40px',
        textAlign: 'center'
      }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Volver atrás
        </button>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50' }}>🛒 Tu Carrito</h1>
        <p style={{ color: '#6c757d' }}>Gestiona tus reservas antes del checkout</p>
      </div>

      {cartItems.length === 0
        ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧳</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Tu carrito está vacío</h2>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Aún no has añadido ningún paquete de viaje al carrito.</p>
            <button
              onClick={() => navigate('/packages')}
              style={{
                background: 'linear-gradient(135deg, #007bff, #0056b3)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Explorar Paquetes
            </button>
          </div>
          )
        : (
          <div className='cart-layout'>
            <div className='cart-packages-section'>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
              >
                <h2 style={{ color: '#2c3e50' }}>Paquetes Seleccionados ({cartItems.length})</h2>
                <button
                  onClick={clearCart}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Svuota tutto
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className='cart-package-item'>
                    <div className='cart-package-image'>
                      <img
                        src={item.packageImage}
                        alt={item.packageTitle}
                      />
                    </div>

                    <div className='cart-package-details'>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}
                      >
                        <h3 style={{ color: '#2c3e50', margin: 0 }}>{item.packageTitle}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '5px'
                          }}
                          title='Eliminar del carrito'
                        >
                          🗑️
                        </button>
                      </div>

                      <p style={{ color: '#6c757d', marginBottom: '15px' }}>📍 {item.destination}</p>

                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>📅 Date:</strong> {formatDate(item.bookingDetails.startDate)} - {formatDate(item.bookingDetails.endDate)}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>👥 Partecipanti:</strong> {item.bookingDetails.passengers} persone
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>💰 Prezzo per persona:</strong> €{item.price}
                        </div>
                      </div>

                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#007bff'
                      }}
                      >
                        Total: €{item.bookingDetails.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='cart-summary-section'>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '20px'
              }}
              >
                <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Resumen del Pedido</h3>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                  >
                    <span>Pacchetti ({cartItems.length})</span>
                    <span>€{getTotalPrice()}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}
                  >
                    <span>Tasse e commissioni</span>
                    <span>€0</span>
                  </div>
                  <hr style={{ border: '1px solid #e9ecef', margin: '15px 0' }} />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                  >
                    <span>Total</span>
                    <span>€{getTotalPrice()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || isProcessing}
                  style={{
                    width: '100%',
                    background: isProcessing
                      ? '#6c757d'
                      : 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: (cartItems.length === 0 || isProcessing) ? 'not-allowed' : 'pointer',
                    opacity: (cartItems.length === 0 || isProcessing) ? 0.6 : 1,
                    marginBottom: '20px'
                  }}
                >
                  {isProcessing ? '⏳ Procesando...' : '💳 Proceder al Pago'}
                </button>

                <div style={{
                  fontSize: '0.9rem',
                  color: '#6c757d',
                  textAlign: 'center'
                }}
                >
                  <p>🔒 Pago seguro y protegido</p>
                  <p>📞 Soporte 24/7 para tus reservas</p>
                </div>
              </div>
            </div>
          </div>
          )}
    </div>
  )
}

export default CartPage
