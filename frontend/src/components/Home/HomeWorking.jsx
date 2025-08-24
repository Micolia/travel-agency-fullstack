import { useContext, useState } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './home.css'

const Home = () => {
  const { token } = useContext(UserContext)
  const navigate = useNavigate()

  const [searchFilters, setSearchFilters] = useState({
    destination: '',
    budget: '',
    checkin: '',
    checkout: ''
  })

  const handleInputChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.id]: e.target.value
    })
  }

  const handleSearch = () => {
    // Crear los parámetros de búsqueda para la URL
    const searchParams = new URLSearchParams()

    if (searchFilters.destination) {
      searchParams.set('destination', searchFilters.destination)
    }

    if (searchFilters.budget) {
      const [min, max] = searchFilters.budget.includes('+')
        ? [searchFilters.budget.replace('+', ''), '']
        : searchFilters.budget.split('-')
      if (min) searchParams.set('minPrice', min)
      if (max) searchParams.set('maxPrice', max)
    }

    // Navegar a la página de paquetes con los filtros
    navigate(`/packages?${searchParams.toString()}`)
  }

  return (
    <div className='home'>
      <Header />

      {/* header */}
      <section className='hero'>
        <Container>
          <Row className='justify-content-center'>
            <Col lg={10} xl={8}>
              <div className='hero-content text-center'>
                <h1>Descubre el Mundo con Nosotros</h1>
                <p>Viajes inolvidables, experiencias auténticas, recuerdos para siempre</p>

                {/* search bar */}
                <div className='search-bar-bootstrap bg-white p-4 rounded-4 shadow'>
                  <Row className='g-3 mb-3'>
                    <Col lg={6} md={6} sm={12}>
                      <Form.Label htmlFor='destination'>Destino</Form.Label>
                      <Form.Control
                        id='destination'
                        type='text'
                        placeholder='¿Dónde quieres ir?'
                        size='lg'
                        value={searchFilters.destination}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Form.Label htmlFor='budget'>Presupuesto</Form.Label>
                      <Form.Select size='lg' id='budget' value={searchFilters.budget} onChange={handleInputChange}>
                        <option value=''>Selecciona</option>
                        <option value='0-500'>€0 - €500</option>
                        <option value='500-1000'>€500 - €1000</option>
                        <option value='1000-2000'>€1000 - €2000</option>
                        <option value='2000+'>€2000+</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className='g-3 mb-3'>
                    <Col lg={6} md={6} sm={12}>
                      <Form.Label htmlFor='checkin'>Salida</Form.Label>
                      <Form.Control
                        id='checkin'
                        type='date'
                        size='lg'
                        value={searchFilters.checkin}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Form.Label htmlFor='checkout'>Regreso</Form.Label>
                      <Form.Control
                        id='checkout'
                        type='date'
                        size='lg'
                        value={searchFilters.checkout}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className='text-center'>
                      <Button variant='primary' size='lg' className='search-btn-custom' onClick={handleSearch}>
                        🔍 Buscar
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* extra packages */}
      <section className='featured-packages py-5'>
        <Container>
          <Row>
            <Col>
              <h2 className='text-center mb-5'>Paquetes Destacados</h2>
            </Col>
          </Row>
          <Row className='g-4'>

            <Col md={6} lg={4}>
              <Card className='h-100 shadow-sm'>
                <Card.Img
                  variant='top'
                  src='/src/assets/img/rome.jpg'
                  alt='Roma Clásica'
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>Roma Clásica</Card.Title>
                  <Card.Text>
                    Explora la ciudad eterna con un tour de 3 días
                  </Card.Text>
                  <div className='mt-auto'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                      <span className='h5 mb-0 text-primary'>€299</span>
                      <span className='badge bg-secondary'>3 días</span>
                    </div>
                    <Button variant='outline-primary' className='w-100'>
                      Más info
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className='h-100 shadow-sm'>
                <Card.Img
                  variant='top'
                  src='/src/assets/img/tuscany.jpg'
                  alt='Toscana y Vino'
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>Toscana y Vino</Card.Title>
                  <Card.Text>
                    Tour enogastronómico por las colinas toscanas
                  </Card.Text>
                  <div className='mt-auto'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                      <span className='h5 mb-0 text-primary'>€450</span>
                      <span className='badge bg-secondary'>5 días</span>
                    </div>
                    <Button variant='outline-primary' className='w-100'>
                      Más info
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className='h-100 shadow-sm'>
                <Card.Img
                  variant='top'
                  src='/src/assets/img/amalfi.jpg'
                  alt='Costa Amalfitana'
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>Costa Amalfitana</Card.Title>
                  <Card.Text>
                    Relax y belleza en la costa más famosa de Italia
                  </Card.Text>
                  <div className='mt-auto'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                      <span className='h5 mb-0 text-primary'>€599</span>
                      <span className='badge bg-secondary'>7 días</span>
                    </div>
                    <Button variant='outline-primary' className='w-100'>
                      Más info
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* testimonials */}
      <section className='testimonials py-5 bg-light'>
        <Container>
          <Row>
            <Col>
              <h2 className='text-center mb-5'>Lo que Dicen Nuestros Viajeros</h2>
            </Col>
          </Row>
          <Row className='g-4'>

            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center'>
                  <Card.Text className='fst-italic mb-4'>
                    &ldquo;¡Una experiencia fantástica! Todo organizado perfectamente.&rdquo;
                  </Card.Text>
                  <div>
                    <strong className='d-block'>Marco R.</strong>
                    <small className='text-muted'>Roma Clásica</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center'>
                  <Card.Text className='fst-italic mb-4'>
                    &ldquo;Los paisajes de la Toscana son impresionantes. ¡Recomendado!&rdquo;
                  </Card.Text>
                  <div>
                    <strong className='d-block'>Laura M.</strong>
                    <small className='text-muted'>Toscana y Vino</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center'>
                  <Card.Text className='fst-italic mb-4'>
                    &ldquo;La Costa Amalfitana es un paraíso. ¡Volveré seguramente!&rdquo;
                  </Card.Text>
                  <div>
                    <strong className='d-block'>Giuseppe T.</strong>
                    <small className='text-muted'>Costa Amalfitana</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  )
}

export default Home
