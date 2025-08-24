import './footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-content'>
          {/* company info */}
          <div className='footer-section'>
            <h3 className='footer-title'>Viajeros</h3>
            <p className='footer-description'>
              Tu compañero perfecto para descubrir el mundo. Ofrecemos experiencias de viaje únicas
              y personalizadas para crear recuerdos inolvidables.
            </p>
            <div className='footer-social'>
              <a href='#' className='social-link' aria-label='Facebook'>
                <i className='fab fa-facebook-f' />
              </a>
              <a href='#' className='social-link' aria-label='Twitter'>
                <i className='fab fa-twitter' />
              </a>
              <a href='#' className='social-link' aria-label='Instagram'>
                <i className='fab fa-instagram' />
              </a>
              <a href='#' className='social-link' aria-label='LinkedIn'>
                <i className='fab fa-linkedin-in' />
              </a>
            </div>
          </div>

          {/* links */}
          <div className='footer-section'>
            <h4 className='footer-subtitle'>Enlaces Rápidos</h4>
            <ul className='footer-links'>
              <li><a href='#'>Sobre Nosotros</a></li>
              <li><a href='#'>Destinos</a></li>
              <li><a href='#'>Paquetes</a></li>
              <li><a href='#'>Blog de Viajes</a></li>
              <li><a href='#'>Contacto</a></li>
            </ul>
          </div>

          {/* services */}
          <div className='footer-section'>
            <h4 className='footer-subtitle'>Servicios</h4>
            <ul className='footer-links'>
              <li><a href='#'>Viajes Grupales</a></li>
              <li><a href='#'>Viajes Individuales</a></li>
              <li><a href='#'>Viajes de Negocios</a></li>
              <li><a href='#'>Alquiler de Coches</a></li>
              <li><a href='#'>Seguro de Viaje</a></li>
            </ul>
          </div>

          {/* contact info */}
          <div className='footer-section'>
            <h4 className='footer-subtitle'>Contacto</h4>
            <div className='footer-contact'>
              <div className='contact-item'>
                <i className='fas fa-map-marker-alt' />
                <span>Calle Ejemplo 123, Madrid, España</span>
              </div>
              <div className='contact-item'>
                <i className='fas fa-phone' />
                <span>+34 900 123 456</span>
              </div>
              <div className='contact-item'>
                <i className='fas fa-envelope' />
                <span>info@viajeros.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className='footer-bottom'>
          <div className='footer-bottom-content'>
            <p>&copy; 2025 Viajeros. Todos los derechos reservados.</p>
            <div className='footer-bottom-links'>
              <a href='#'>Términos y Condiciones</a>
              <a href='#'>Política de Privacidad</a>
              <a href='#'>Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
