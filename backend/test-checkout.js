// Test checkout endpoint
import fetch from 'node-fetch';

const testCheckout = async () => {
  try {
    // Prima facciamo login per ottenere un token
    console.log('🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@google.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login fallido');
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso:', loginData.user.email);

    // Simular un carrello con un elemento
    const cartItems = [
      {
        id: 1, // ID del pacchetto
        bookingDetails: {
          startDate: '2025-09-15',
          endDate: '2025-09-18',
          passengers: 2
        }
      }
    ];

    // Test checkout
    console.log('🛒 Testando checkout...');
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
      console.log('✅ Checkout exitoso!');
      console.log('📋 Respuesta:', checkoutData);
    } else {
      console.log('❌ Error en checkout:', checkoutData);
    }

  } catch (error) {
    console.error('❌ Error en test:', error.message);
  }
};

testCheckout();
