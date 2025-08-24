import fetch from 'node-fetch';

const testRegister = async () => {
  try {
    console.log('Testing registration...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: 'TestUser',
        apellido: 'Demo',
        email: 'nuovotest' + Date.now() + '@demo.com',
        password: 'password123',
        user_type: 'traveler',
        phone: '1234567890',
        nacimiento: '1990-01-01'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testRegister();
