import fetch from 'node-fetch';

const testMyBookings = async () => {
  try {
    console.log('🧪 Testing /api/bookings/my-bookings endpoint');
    
    // First, we need to get a valid token by logging in
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'oggi@test.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful, token obtained');
    
    // Now test the my-bookings endpoint
    const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('My bookings response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testMyBookings();
