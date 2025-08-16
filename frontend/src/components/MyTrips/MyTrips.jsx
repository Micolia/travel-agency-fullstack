import { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '../../context/UserContext'
import './myTrips.css'

const MyTrips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'confirmed', 'pending', 'cancelled'
  const { token } = useContext(UserContext)

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar las reservas')
      }

      const bookings = await response.json()
      setTrips(bookings)
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchMyBookings()
    }
  }, [token, fetchMyBookings])

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '✅ Confirmada'
      case 'pending': return '🔜 Pendiente'
      case 'cancelled': return '❌ Cancelada'
      default: return status || '🔜 Pendiente'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const getDateStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'ongoing'
    return 'completed'
  }

  const filteredTrips = trips.filter(trip =>
    filter === 'all' || trip.status === filter
  )

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!token) {
    return (
      <div className='mytrips-container'>
        <div className='login-required'>
          <h2>Acceso requerido</h2>
          <p>Inicia sesión para ver tus reservas</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='mytrips-container'>
        <div className='loading'>
          <h2>⏳ Cargando reservas...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mytrips-container'>
        <div className='error'>
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchMyBookings} className='btn-retry'>
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='mytrips-container'>
      <div className='mytrips-header'>
        <h1>📅 Mis Reservas</h1>
        <p>Gestiona y revive tus aventuras</p>
      </div>

      {/* filters */}
      <div className='filters-container'>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({trips.length})
        </button>
        <button
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmadas ({trips.filter(t => t.status === 'confirmed').length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendientes ({trips.filter(t => (t.status || 'pending') === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Canceladas ({trips.filter(t => t.status === 'cancelled').length})
        </button>
      </div>

      {/* trips list */}
      <div className='trips-grid'>
        {filteredTrips.length === 0
          ? (
            <div className='no-trips'>
              <h3>🧳 Ninguna reserva encontrada</h3>
              <p>Aún no tienes reservas en esta categoría</p>
            </div>
            )
          : (
              filteredTrips.map((trip) => (
                <div key={trip.id} className='trip-card'>
                  <div className='trip-image-container'>
                    <img
                      src={trip.image_url || '/src/assets/img/earth.png'}
                      alt={trip.package_name}
                      className='trip-image'
                    />
                    <div className={`trip-status ${getStatusClass(trip.status)}`}>
                      {getStatusText(trip.status)}
                    </div>
                  </div>

                  <div className='trip-info'>
                    <h3>{trip.package_name}</h3>
                    <p className='trip-destination'>📍 {trip.destination}</p>

                    <div className='trip-dates'>
                      <span>📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                    </div>

                    <div className='trip-details'>
                      <div className='trip-detail-item'>
                        <strong>👥 Participantes:</strong> {trip.passengers}
                      </div>
                      <div className='trip-detail-item'>
                        <strong>⏱️ Duración:</strong> {trip.duration_days ? `${trip.duration_days} días` : 'N/A'}
                      </div>
                      {trip.payment_status && (
                        <div className='trip-detail-item'>
                          <strong>💳 Pago:</strong> <span className={`payment-status payment-${trip.payment_status}`}>
                            {trip.payment_status === 'completed'
? '✅ Completado' 
                             : trip.payment_status === 'pending'
? '⏳ Pendiente' 
                             : trip.payment_status === 'failed' ? '❌ Fallido' : trip.payment_status}
                                                    </span>
                        </div>
                      )}
                      {trip.transaction_id && (
                        <div className='trip-detail-item'>
                          <strong>🧾 Transacción:</strong> {trip.transaction_id}
                        </div>
                      )}
                      {trip.special_requests && (
                        <div className='trip-detail-item'>
                          <strong>📝 Solicitudes especiales:</strong> {trip.special_requests}
                        </div>
                      )}
                    </div>

                    <div className='trip-footer'>
                      <div className='trip-price'>
                        <strong>€{trip.total_price}</strong>
                      </div>
                      <div className='trip-code'>
                        Código: {trip.booking_code}
                      </div>
                    </div>

                    <div className='trip-actions'>
                      <button className='btn-details'>📋 Detalles</button>
                      {trip.status === 'confirmed' && getDateStatus(trip.start_date, trip.end_date) === 'completed' && (
                        <button className='btn-review'>⭐ Reseña</button>
                      )}
                      {trip.status === 'confirmed' && getDateStatus(trip.start_date, trip.end_date) !== 'completed' && (
                        <button className='btn-manage'>⚙️ Gestionar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

export default MyTrips
