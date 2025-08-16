// Test endpoint API reale
const testAPIEndpoint = async () => {
  try {
    console.log('🔧 Test endpoint API /api/bookings/checkout');
    
    // 1. Login per ottenere token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@google.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login fallito');
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');

    // 2. Test checkout
    const cartItems = [
      {
        id: 2, // Package Costa Amalfitana
        bookingDetails: {
          startDate: '2025-10-01',
          endDate: '2025-10-07',
          passengers: 1
        }
      }
    ];

    console.log('🛒 Testando endpoint checkout...');
    const checkoutResponse = await fetch('http://localhost:5000/api/bookings/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        cart_items: cartItems
      })
    });

    const checkoutData = await checkoutResponse.json();
    
    if (checkoutResponse.ok) {
      console.log('✅ Checkout API exitoso!');
      console.log('📋 Respuesta:', JSON.stringify(checkoutData, null, 2));
    } else {
      console.log('❌ Error en checkout API:', checkoutData);
    }

    // 3. Test endpoint mis reservas
    console.log('\n🔍 Testando endpoint mis reservas...');
    const bookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    const bookingsData = await bookingsResponse.json();
    
    if (bookingsResponse.ok) {
      console.log('✅ Mis reservas API exitoso!');
      console.log(`📋 Reservas encontradas: ${bookingsData.length}`);
      bookingsData.forEach(booking => {
        console.log(`- ${booking.package_name}: €${booking.total_price} - Pago: ${booking.payment_status}`);
      });
    } else {
      console.log('❌ Error en mis reservas API:', bookingsData);
    }

  } catch (error) {
    console.error('❌ Error en test API:', error.message);
  }
};

testAPIEndpoint();
