import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { CartContext } from '../../context/CartContext'
import './packageDetail.css'
import { API_BASE_URL } from '../../config'

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
    // Carica dettagli pacchetto dal backend
    const fetchPackageDetail = async () => {
      try {
        setLoading(true)

        // Prima prova a caricare dal backend
        const response = await fetch(`${API_BASE_URL}/packages/${id}`)

        if (response.ok) {
          const data = await response.json()
          console.log('Dettagli pacchetto dal backend:', data)

          // Mappa i dati del backend al formato del frontend
          const mappedPackage = {
            id: data.id,
            title: data.title,
            destination: data.destination,
            description: data.description,
            price: data.price,
            image: data.image_url || '/src/assets/img/default.jpg',
            duration: `${data.duration_days} días`,
            rating: data.rating || 4.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            maxParticipants: data.max_participants || 20,
            availableDates: data.start_date ? [data.start_date] : ['2025-09-15', '2025-09-22'],
            services: [
              'Guía turística profesional',
              'Transportes incluidos',
              'Seguro de viaje',
              'Asistencia 24/7'
            ],
            itinerary: [
              {
                day: 1,
                title: 'Día de llegada',
                activities: 'Llegada al destino y orientación inicial'
              },
              {
                day: 2,
                title: 'Exploración principal',
                activities: 'Visita a los puntos principales de interés'
              }
            ],
            organizer: {
              name: 'Tour Organizer',
              rating: 4.8,
              toursCompleted: Math.floor(Math.random() * 100) + 50
            }
          }

          setPackageData(mappedPackage)
        } else {
          console.error('Package not found in backend, usando datos mock')
          loadMockData()
        }
      } catch (error) {
        console.error('Error fetching package details:', error)
        loadMockData()
      } finally {
        setLoading(false)
      }
    }

    const loadMockData = () => {
      // Dati mock come fallback
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
        },
        3: {
          id: 3,
          title: 'Costa Amalfitana',
          destination: 'Amalfi, Italia',
          description: 'Relajación y belleza en la costa más famosa de Italia. Descubre pueblos encantadores con vistas espectaculares al mar Mediterráneo.',
          price: 599,
          image: '/src/assets/img/amalfi.jpg',
          duration: '7 días / 6 noches',
          rating: 4.7,
          reviews: 156,
          maxParticipants: 18,
          availableDates: ['2025-09-05', '2025-09-12', '2025-09-19', '2025-09-26'],
          services: [
            'Hotel 4 estrellas frente al mar',
            'Traslados privados',
            'Excursión en barco a Capri',
            'Degustación de limoncello',
            'Guía local experta',
            'Desayuno continental'
          ],
          itinerary: [
            {
              day: 1,
              title: 'Llegada a Sorrento',
              activities: 'Llegada al aeropuerto de Nápoles, traslado a Sorrento. Check-in en el hotel y cena de bienvenida con vista al Golfo.'
            },
            {
              day: 2,
              title: 'Positano y Amalfi',
              activities: 'Excursión por la costa amalfitana visitando Positano y Amalfi. Tiempo libre para compras y almuerzo frente al mar.'
            },
            {
              day: 3,
              title: 'Capri y Gruta Azul',
              activities: 'Excursión en barco a la isla de Capri. Visita a la famosa Gruta Azul y tour por el centro de Capri.'
            }
          ],
          organizer: {
            name: 'Amalfi Coast Tours',
            rating: 4.7,
            toursCompleted: 189
          }
        },
        4: {
          id: 4,
          title: 'Venecia Romántica',
          destination: 'Venezia, Italia',
          description: 'Un fin de semana romántico en la ciudad de los canales. Paseos en góndola, arte y arquitectura única en el mundo.',
          price: 349,
          image: '/src/assets/img/venice.jpg',
          duration: '2 días / 1 noche',
          rating: 4.6,
          reviews: 203,
          maxParticipants: 12,
          availableDates: ['2025-08-30', '2025-09-06', '2025-09-13', '2025-09-20'],
          services: [
            'Hotel boutique en el centro histórico',
            'Paseo en góndola privada',
            'Entrada al Palacio Ducal',
            'Cena romántica con vista al canal',
            'Guía especializada en arte veneciano'
          ],
          itinerary: [
            {
              day: 1,
              title: 'Plaza San Marcos y Palacio Ducal',
              activities: 'Llegada a Venecia. Visita a la Plaza San Marcos, Basílica y Palacio Ducal. Paseo en góndola al atardecer.'
            },
            {
              day: 2,
              title: 'Murano y Burano',
              activities: 'Excursión a las islas de Murano (cristal) y Burano (encajes coloridos). Regreso y cena romántica.'
            }
          ],
          organizer: {
            name: 'Venice Romance Tours',
            rating: 4.6,
            toursCompleted: 245
          }
        },
        5: {
          id: 5,
          title: 'Sicilia Auténtica',
          destination: 'Sicilia, Italia',
          description: 'Descubre los tesoros escondidos de Sicilia, entre volcanes activos, templos griegos y una gastronomía única.',
          price: 520,
          image: '/src/assets/img/sicilia.jpg',
          duration: '6 días / 5 noches',
          rating: 4.8,
          reviews: 98,
          maxParticipants: 16,
          availableDates: ['2025-09-08', '2025-09-15', '2025-09-22', '2025-09-29'],
          services: [
            'Hoteles característicos en Taormina y Agrigento',
            'Excursión al volcán Etna',
            'Visita al Valle de los Templos',
            'Clase de cocina siciliana',
            'Degustación de vinos del Etna',
            'Guía arqueológica experta'
          ],
          itinerary: [
            {
              day: 1,
              title: 'Catania y Taormina',
              activities: 'Llegada a Catania, traslado a Taormina. Visita del teatro griego y paseo por el centro histórico.'
            },
            {
              day: 2,
              title: 'Volcán Etna',
              activities: 'Excursión al volcán Etna. Ascensión en teleférico y trekking en los cráteres. Degustación de productos locales.'
            },
            {
              day: 3,
              title: 'Valle de los Templos',
              activities: 'Traslado a Agrigento. Visita al Valle de los Templos, patrimonio UNESCO. Clase de cocina siciliana.'
            }
          ],
          organizer: {
            name: 'Sicilia Autentica Tours',
            rating: 4.8,
            toursCompleted: 134
          }
        },
        6: {
          id: 6,
          title: 'Aventura en las Dolomitas',
          destination: 'Trentino, Italia',
          description: 'Senderismo y naturaleza en las montañas más bellas de los Alpes. Paisajes de postal y aventuras al aire libre.',
          price: 380,
          image: '/src/assets/img/dolomiti.jpg',
          duration: '4 días / 3 noches',
          rating: 4.9,
          reviews: 67,
          maxParticipants: 14,
          availableDates: ['2025-08-25', '2025-09-01', '2025-09-08', '2025-09-15'],
          services: [
            'Refugio de montaña típico',
            'Guía de montaña certificado',
            'Equipamiento de senderismo',
            'Teleféricos incluidos',
            'Degustación de productos alpinos',
            'Seguro de montaña'
          ],
          itinerary: [
            {
              day: 1,
              title: 'Llegada y Alpe di Siusi',
              activities: 'Llegada a Bolzano, traslado al Alpe di Siusi. Primer trekking fácil y familiarización con el entorno.'
            },
            {
              day: 2,
              title: 'Tre Cime di Lavaredo',
              activities: 'Excursión a las famosas Tre Cime di Lavaredo. Senderismo de dificultad media con vistas espectaculares.'
            },
            {
              day: 3,
              title: 'Val di Funes y Seceda',
              activities: 'Visita al Val di Funes y ascensión a Seceda en teleférico. Fotografía paisajística y relajación en la naturaleza.'
            }
          ],
          organizer: {
            name: 'Dolomites Adventure',
            rating: 4.9,
            toursCompleted: 78
          }
        }
      }

      const foundPackage = mockPackages[id]
      if (foundPackage) {
        setPackageData(foundPackage)
      } else {
        setPackageData(null)
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
