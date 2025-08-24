import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import './createPackage.css'

const CreatePackage = () => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    duration: '',
    price: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    image: '',
    category: 'adventure',
    services: [''],
    itinerary: [{ day: 1, activities: '' }]
  })

  const { token, isOrganizer, isAdmin } = useContext(UserContext)
  const navigate = useNavigate()

  // check user type
  if (!token || (!isOrganizer() && !isAdmin())) {
    return (
      <div className='create-package-container'>
        <div className='access-denied'>
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los organizadores y administradores pueden crear paquetes de viaje.</p>
          <button onClick={() => navigate('/')} className='btn-home'>
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (index, value) => {
    const newServices = [...formData.services]
    newServices[index] = value
    setFormData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }))
  }

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary]
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }))
  }

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        day: prev.itinerary.length + 1,
        activities: ''
      }]
    }))
  }

  const removeItineraryDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index)
    // order days
    const reorderedItinerary = newItinerary.map((item, i) => ({
      ...item,
      day: i + 1
    }))

    setFormData(prev => ({
      ...prev,
      itinerary: reorderedItinerary
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validation
    if (!formData.title || !formData.destination || !formData.price) {
      alert('Compila tutti i campi obbligatori')
      return
    }

    try {
      // API CALL
      console.log('Creazione pacchetto:', formData)

      // test api call
      const response = await fetch('http://localhost:5000/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Pacchetto creato con successo!')
        navigate('/packages')
      } else {
        throw new Error('Errore nella creazione del pacchetto')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore nella creazione del pacchetto. Riprova.')
    }
  }

  return (
    <div className='create-package-container'>
      <div className='create-package-header'>
        <h1>📦 Crear Nuevo Paquete</h1>
        <p>Comparte tu experiencia y crea viajes inolvidables</p>
      </div>

      <form onSubmit={handleSubmit} className='package-form'>
        {/* info */}
        <div className='form-section'>
          <h2>ℹ️ Información Básica</h2>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='title'>Título del Paquete *</label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='ej. Roma Clásica - Tour 3 días'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='destination'>Destino *</label>
              <input
                type='text'
                id='destination'
                name='destination'
                value={formData.destination}
                onChange={handleInputChange}
                placeholder='ej. Roma, Italia'
                required
              />
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='description'>Descripción</label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder='Describe tu paquete de viaje...'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='image'>URL de Imagen</label>
            <input
              type='url'
              id='image'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
              placeholder='https://example.com/image.jpg'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='category'>Categoría</label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value='adventure'>Aventura</option>
              <option value='cultural'>Cultural</option>
              <option value='relaxation'>Relajación</option>
              <option value='nature'>Naturaleza</option>
              <option value='city'>Ciudad</option>
              <option value='beach'>Playa</option>
            </select>
          </div>
        </div>

        {/* trip */}
        <div className='form-section'>
          <h2>📅 Detalles del Viaje</h2>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='duration'>Duración</label>
              <input
                type='text'
                id='duration'
                name='duration'
                value={formData.duration}
                onChange={handleInputChange}
                placeholder='ej. 3 días'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='price'>Precio (€) *</label>
              <input
                type='number'
                id='price'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                placeholder='299'
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='maxParticipants'>Máximo Participantes</label>
              <input
                type='number'
                id='maxParticipants'
                name='maxParticipants'
                value={formData.maxParticipants}
                onChange={handleInputChange}
                placeholder='20'
                min='1'
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='startDate'>Fecha de Inicio</label>
              <input
                type='date'
                id='startDate'
                name='startDate'
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='endDate'>Fecha de Finalización</label>
              <input
                type='date'
                id='endDate'
                name='endDate'
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* services */}
        <div className='form-section'>
          <h2>✅ Servicios Incluidos</h2>

          {formData.services.map((service, index) => (
            <div key={index} className='service-row'>
              <input
                type='text'
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                placeholder='ej. Hotel de 4 estrellas'
                className='service-input'
              />
              {formData.services.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeService(index)}
                  className='btn-remove'
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            type='button'
            onClick={addService}
            className='btn-add'
          >
            ➕ Agregar Servicio
          </button>
        </div>

        {/* trip details */}
        <div className='form-section'>
          <h2>🗓️ Itinerario Día a Día</h2>

          {formData.itinerary.map((day, index) => (
            <div key={index} className='itinerary-day'>
              <div className='day-header'>
                <h4>Día {day.day}</h4>
                {formData.itinerary.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeItineraryDay(index)}
                    className='btn-remove'
                  >
                    ❌
                  </button>
                )}
              </div>
              <textarea
                value={day.activities}
                onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                placeholder='Describe las actividades del día...'
                rows={3}
                className='itinerary-textarea'
              />
            </div>
          ))}

          <button
            type='button'
            onClick={addItineraryDay}
            className='btn-add'
          >
            ➕ Agregar Día
          </button>
        </div>

        {/* form buttons */}
        <div className='form-actions'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='btn-cancel'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='btn-submit'
          >
            🚀 Crear Paquete
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePackage
