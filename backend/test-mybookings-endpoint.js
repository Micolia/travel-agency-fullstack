import { q } from './config/db.js';
import jwt from 'jsonwebtoken';

const testMyBookingsEndpoint = async () => {
  try {
    console.log('🧪 Test endpoint /api/bookings/my-bookings');
    
    // Creiamo un token JWT valido per l'utente test
    const user = { id: 2, email: 'test@google.com', user_type: 'traveler' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('✅ Token generato per user ID:', user.id);
    
    // Test endpoint
    const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const bookings = await response.json();
      console.log('✅ Endpoint funziona!');
      console.log(`📋 Prenotazioni trovate: ${bookings.length}`);
      
      bookings.forEach(booking => {
        console.log(`- ${booking.package_name}: ${booking.booking_code}`);
        console.log(`  Status: ${booking.status} | Pago: ${booking.payment_status}`);
      });
    } else {
      const errorData = await response.json();
      console.log('❌ Errore endpoint:', response.status, errorData);
    }

  } catch (error) {
    console.error('❌ Errore nel test:', error.message);
  }
  
  process.exit(0);
};

testMyBookingsEndpoint();
