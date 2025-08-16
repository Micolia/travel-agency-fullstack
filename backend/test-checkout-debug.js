import fetch from 'node-fetch';

// Test del checkout endpoint
async function testCheckout() {
  try {
    // Simula dati del carrello come vengono inviati dal frontend
    const cartData = {
      cart_items: [
        {
          id: 1, // ID del pacchetto
          bookingDetails: {
            passengers: 2,
            startDate: '2025-09-01',
            endDate: '2025-09-07'
          }
        }
      ]
    };

    // Token JWT valido (devi sostituire con un token reale)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTcyMzc0MDM4NSwiZXhwIjoxNzIzNzQ3NTg1fQ.VaxC0Kji6fT1-7Zd-oLBG0r_OOHlKBCsRbhNPpbGIGM';

    console.log('🧪 Testando checkout endpoint...');
    console.log('Dati inviati:', JSON.stringify(cartData, null, 2));

    const response = await fetch('http://localhost:5000/api/bookings/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cartData)
    });

    const responseText = await response.text();
    console.log('\n📊 Risposta HTTP Status:', response.status);
    console.log('📋 Risposta Headers:', Object.fromEntries(response.headers));
    console.log('📄 Risposta Body:', responseText);

    if (response.status === 500) {
      console.log('\n❌ ERRORE 500 - Controllare i log del server');
    }

  } catch (error) {
    console.error('❌ Errore nel test:', error.message);
  }
}

testCheckout();
