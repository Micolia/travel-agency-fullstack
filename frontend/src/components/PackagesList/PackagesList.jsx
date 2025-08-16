import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './packagesList.css'

const PackagesList = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    destination: '',
    minPrice: '',
    maxPrice: '',
    duration: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    // test api call
    const fetchPackages = async () => {
      try {
        // test data
        const mockPackages = [
          {
            id: 1,
            title: 'Roma Clásica',
            destination: 'Roma, Italia',
            description: 'Explora la ciudad eterna con un tour de 3 días',
            price: 299,
            image: '/src/assets/img/rome.jpg',
            duration: '3 días',
            rating: 4.8,
            reviews: 124
          },
          {
            id: 2,
            title: 'Toscana y Vino',
            description: 'Tour enogastronómico entre las colinas toscanas',
            destination: 'Toscana, Italia',
            price: 450,
            image: '/src/assets/img/tuscany.jpg',
            duration: '5 días',
            rating: 4.9,
            reviews: 89
          },
          {
            id: 3,
            title: 'Costa Amalfitana',
            description: 'Relajación y belleza en la costa más famosa de Italia',
            destination: 'Amalfi, Italia',
            price: 599,
            image: '/src/assets/img/amalfi.jpg',
            duration: '7 días',
            rating: 4.7,
            reviews: 156
          },
          {
            id: 4,
            title: 'Venecia Romántica',
            description: 'Un fin de semana romántico en la ciudad de los canales',
            destination: 'Venezia, Italia',
            price: 349,
            image: '/src/assets/img/venice.jpg',
            duration: '2 días',
            rating: 4.6,
            reviews: 203
          },
          {
            id: 5,
            title: 'Sicilia Auténtica',
            description: 'Descubre los tesoros escondidos de Sicilia',
            destination: 'Sicilia, Italia',
            price: 520,
            image: '/src/assets/img/sicilia.jpg',
            duration: '6 días',
            rating: 4.8,
            reviews: 98
          },
          {
            id: 6,
            title: 'Aventura en las Dolomitas',
            description: 'Senderismo y naturaleza en las montañas más bellas',
            destination: 'Trentino, Italia',
            price: 380,
            image: '/src/assets/img/dolomiti.jpg',
            duration: '4 días',
            rating: 4.9,
            reviews: 67
          }
        ]

        // net delay
        setTimeout(() => {
          setPackages(mockPackages)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error al cargar los paquetes:', error)
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesDestination = !filters.destination ||
      pkg.destination.toLowerCase().includes(filters.destination.toLowerCase())

    const matchesMinPrice = !filters.minPrice || pkg.price >= parseInt(filters.minPrice)
    const matchesMaxPrice = !filters.maxPrice || pkg.price <= parseInt(filters.maxPrice)

    const matchesDuration = !filters.duration || pkg.duration.includes(filters.duration)

    return matchesDestination && matchesMinPrice && matchesMaxPrice && matchesDuration
  })

  const clearFilters = () => {
    setFilters({
      destination: '',
      minPrice: '',
      maxPrice: '',
      duration: ''
    })
  }

  if (loading) {
    return (
      <div className='packages-container'>
        <div className='loading'>
          <h2>Cargando paquetes...</h2>
          <div className='spinner' />
        </div>
      </div>
    )
  }

  return (
    <div className='packages-container'>
      <div className='packages-header'>
        <h1>🧳 Todos los Paquetes</h1>
        <p>Encuentra el viaje perfecto para ti</p>
      </div>

      <div className='filters-section'>
        <h3>🔍 Filtrar los resultados</h3>
        <div className='filters-grid'>
          <div className='filter-group'>
            <label>Destino</label>
            <input
              type='text'
              placeholder='ej. Roma, Toscana...'
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
              className='filter-input'
            />
          </div>

          <div className='filter-group'>
            <label>Precio mínimo (€)</label>
            <input
              type='number'
              placeholder='0'
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className='filter-input'
            />
          </div>

          <div className='filter-group'>
            <label>Precio máximo (€)</label>
            <input
              type='number'
              placeholder='1000'
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className='filter-input'
            />
          </div>

          <div className='filter-group'>
            <label>Duración</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className='filter-select'
            >
              <option value=''>Todas</option>
              <option value='2'>Fin de semana (2 días)</option>
              <option value='3'>Corto (3 días)</option>
              <option value='4'>Mediano (4-5 días)</option>
              <option value='6'>Largo (6-7 días)</option>
            </select>
          </div>

          <div className='filter-actions'>
            <button onClick={clearFilters} className='btn-clear-filters'>
              🗑️ Limpiar
            </button>
          </div>
        </div>

        <div className='results-count'>
          Encontrados {filteredPackages.length} paquetes
        </div>
      </div>

      <div className='packages-grid'>
        {filteredPackages.length === 0
          ? (
            <div className='no-results'>
              <h3>😕 Ningún paquete encontrado</h3>
              <p>Intenta modificar los filtros de búsqueda</p>
              <button onClick={clearFilters} className='btn-reset'>
                Mostrar todos los paquetes
              </button>
            </div>
            )
          : (
              filteredPackages.map((pkg) => (
                <div key={pkg.id} className='package-card'>
                  <div className='package-image-container'>
                    <img src={pkg.image} alt={pkg.title} className='package-image' />
                    <div className='package-overlay'>
                      <button
                        className='btn-view-details'
                        onClick={() => navigate(`/package/${pkg.id}`)}
                      >
                        👁️ Detalles
                      </button>
                    </div>
                  </div>

                  <div className='package-info'>
                    <h3>{pkg.title}</h3>
                    <p className='package-destination'>📍 {pkg.destination}</p>
                    <p className='package-description'>{pkg.description}</p>

                    <div className='package-meta'>
                      <span className='duration'>⏰ {pkg.duration}</span>
                      <span className='rating'>⭐ {pkg.rating} ({pkg.reviews})</span>
                    </div>

                    <div className='package-footer'>
                      <div className='package-price'>
                        <strong>€{pkg.price}</strong>
                        <small>por persona</small>
                      </div>
                      <button
                        className='btn-book'
                        onClick={() => navigate(`/package/${pkg.id}`)}
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

export default PackagesList
