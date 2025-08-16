import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { CartContext } from '../../context/CartContext'
import './packageDetail.css'

const PackageDetail = () => {
  const { id } = useParams()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [participants, setParticipants] = useState(1)
  const { token } = useContext(UserContext)
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    // test api call
    const fetchPackageDetail = async () => {
      try {
        // APP CALL
        // const response = await fetch(`/api/packages/${id}`)
        // const data = await response.json()

        // testing
        const mockPackages = {
          1: {
            id: 1,
            title: 'Roma Clásica',
            destination: 'Roma, Italia',
            description: 'Explora la ciudad eterna con un tour completo de 3 días. Visitarás los monumentos más icónicos, degustarás la cocina local y descubrirás la historia milenaria de Roma.',
            price: 299,
            image: '/src/assets/img/rome.jpg',
            duration: '3 días / 2 noches',
            rating: 4.8,
            reviews: 124,
            maxParticipants: 20,
            availableDates: ['2025-09-15', '2025-09-22', '2025-09-29', '2025-10-06'],
            services: [
              'Hotel de 4 estrellas en el centro histórico',
              'Guía turística profesional',
              'Desayuno incluido',
              'Transportes locales incluidos',
              'Entrada a los museos principales',
              'Seguro de viaje'
            ],
            itinerary: [
              {
                day: 1,
                title: 'Llegada y Centro Histórico',
                activities: 'Llegada a Roma, check-in en el hotel. Por la tarde, visita guiada del Coliseo y de los Foros Imperiales. Cena típica en una trattoria del centro.'
              },
              {
                day: 2,
                title: 'Vaticano y Castillo Sant\'Angelo',
                activities: 'Mañana dedicada a la visita de los Museos Vaticanos y de la Capilla Sixtina. Tarde en el Castillo Sant\'Angelo y paseo por el Tíber.'
              },
              {
                day: 3,
                title: 'Fuentes y Plazas',
                activities: 'Tour por las fuentes y plazas más bellas: Fuente de Trevi, Plaza de España, Panteón. Compras y salida.'
              }
            ],
            organizer: {
              name: 'Marco Tour Operator',
              rating: 4.9,
              toursCompleted: 156
            }
          },
          2: {
            id: 2,
            title: 'Toscana y Vino',
            destination: 'Toscana, Italia',
            description: 'Un viaje enogastronómico entre las colinas toscanas, entre pueblos medievales, bodegas históricas y paisajes impresionantes.',
            price: 450,
            image: '/src/assets/img/tuscany.jpg',
            duration: '5 días / 4 noches',
            rating: 4.9,
            reviews: 89,
            maxParticipants: 15,
            availableDates: ['2025-08-10', '2025-08-17', '2025-08-24'],
            services: [
              'Agriturismo de encanto',
              'Degustaciones de vinos DOC',
              'Tour por las bodegas',
              'Clase de cocina típica',
              'Transportes privados'
            ],
            itinerary: [
              {
                day: 1,
                title: 'Florencia y Chianti',
                activities: 'Llegada a Florencia, traslado a Chianti. Primera degustación en una bodega histórica.'
              },
              {
                day: 2,
                title: 'San Gimignano y Volterra',
                activities: 'Visita a los pueblos medievales de San Gimignano y Volterra. Degustación de Vernaccia.'
              }
            ],
            organizer: {
              name: 'Tuscany Experience',
              rating: 4.8,
              toursCompleted: 203
            }
          }
        }

        // net delay simulation
        setTimeout(() => {
          setPackageData(mockPackages[id] || null)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error al cargar el paquete:', error)
        setLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id])

  const handleBooking = () => {
    if (!token) {
      navigate('/login')
      return
    }

    if (!selectedDate) {
      alert('Selecciona una fecha de salida')
      return
    }

    // add to cart
    const bookingDetails = {
      startDate: selectedDate,
      endDate: selectedDate, // tbd
      passengers: participants
    }

    addToCart(packageData, bookingDetails)

    // confirmation message
    alert(`¡Paquete agregado al carrito! Total: €${packageData.price * participants}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData.title,
        text: packageData.description,
        url: window.location.href
      })
    } else {
      // fallback: copy URL
      navigator.clipboard.writeText(window.location.href)
      alert('¡Enlace copiado al portapapeles!')
    }
  }

  const addToFavorites = () => {
    // lógica para agregar a favoritos
    console.log('Agregado a favoritos:', id)
    alert('¡Paquete agregado a favoritos!')
  }

  if (loading) {
    return (
      <div className='package-detail-container'>
        <div className='loading'>
          <h2>Cargando...</h2>
          <div className='spinner' />
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className='package-detail-container'>
        <div className='not-found'>
          <h2>🚫 Paquete no encontrado</h2>
          <p>El paquete que buscas no existe o ha sido removido.</p>
          <button onClick={() => navigate('/')} className='btn-home'>
            Volver a la Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='package-detail-container'>
      <div className='package-hero'>
        <img src={packageData.image} alt={packageData.title} className='hero-image' />
        <div className='hero-overlay'>
          <div className='hero-content package-detail-hero'>
            <h1>{packageData.title}</h1>
            <p className='destination'>📍 {packageData.destination}</p>
            <div className='hero-stats'>
              <span className='rating'>⭐ {packageData.rating} ({packageData.reviews} recensioni)</span>
              <span className='duration'>⏰ {packageData.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='package-content'>
        <div className='main-content'>
          <section className='description-section'>
            <h2>📖 Descrizione</h2>
            <p>{packageData.description}</p>
          </section>

          <section className='services-section'>
            <h2>✅ Servizi Inclusi</h2>
            <div className='services-grid'>
              {packageData.services.map((service, index) => (
                <div key={index} className='service-item'>
                  <span className='service-icon'>✓</span>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='itinerary-section'>
            <h2>🗓️ Itinerario Dettagliato</h2>
            <div className='itinerary-timeline'>
              {packageData.itinerary.map((day, index) => (
                <div key={index} className='timeline-item'>
                  <div className='timeline-marker'>
                    <span>{day.day}</span>
                  </div>
                  <div className='timeline-content'>
                    <h4>{day.title}</h4>
                    <p>{day.activities}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='organizer-section'>
            <h2>👤 Organizzatore</h2>
            <div className='organizer-card'>
              <div className='organizer-avatar'>
                {packageData.organizer.name.charAt(0)}
              </div>
              <div className='organizer-info'>
                <h4>{packageData.organizer.name}</h4>
                <div className='organizer-stats'>
                  <span>⭐ {packageData.organizer.rating}</span>
                  <span>🎯 {packageData.organizer.toursCompleted} tour completati</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className='booking-sidebar'>
          <div className='booking-card'>
            <div className='price-section'>
              <h3>€{packageData.price}</h3>
              <span>a persona</span>
            </div>

            <div className='booking-form'>
              <div className='form-group'>
                <label>Fecha de salida</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className='date-select'
                >
                  <option value=''>Selecciona fecha</option>
                  {packageData.availableDates.map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label>Participantes</label>
                <div className='participants-selector'>
                  <button
                    type='button'
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className='btn-quantity'
                  >
                    -
                  </button>
                  <span className='participants-count'>{participants}</span>
                  <button
                    type='button'
                    onClick={() => setParticipants(Math.min(packageData.maxParticipants, participants + 1))}
                    className='btn-quantity'
                  >
                    +
                  </button>
                </div>
                <small>Max {packageData.maxParticipants} partecipanti</small>
              </div>

              <div className='total-price'>
                <strong>Totale: €{packageData.price * participants}</strong>
              </div>

              <button
                onClick={handleBooking}
                className='btn-book-now'
                disabled={!selectedDate}
              >
                🎯 Reserva ahora
              </button>
            </div>

            <div className='action-buttons'>
              <button onClick={handleShare} className='btn-action'>
                🔄 Condividi
              </button>
              <button onClick={addToFavorites} className='btn-action'>
                ❤️ Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetail
