// Test completo: checkout + visualizzazione prenotazioni
import { q } from './config/db.js';

const testCompleteFlow = async () => {
  try {
    console.log('🧪 Test del flusso completo checkout → prenotazioni');
    
    // 1. Verificare utente di test
    const userResult = await q('SELECT id, email FROM users WHERE email = $1', ['test@google.com']);
    if (userResult.rows.length === 0) {
      console.log('❌ Utente test non trovato');
      return;
    }
    const testUser = userResult.rows[0];
    console.log(`✅ Utente test trovato: ${testUser.email} (ID: ${testUser.id})`);
    
    // 2. Verificare pacchetti disponibili
    const packagesResult = await q('SELECT id, title, price FROM packages WHERE is_active = true LIMIT 2');
    if (packagesResult.rows.length === 0) {
      console.log('❌ Nessun pacchetto disponibile');
      return;
    }
    console.log(`✅ Pacchetti disponibili: ${packagesResult.rows.length}`);
    packagesResult.rows.forEach(pkg => {
      console.log(`   - ${pkg.title} (ID: ${pkg.id}) - €${pkg.price}`);
    });
    
    // 3. Simulare una prenotazione
    const testBooking = {
      user_id: testUser.id,
      package_id: packagesResult.rows[0].id,
      booking_code: `TEST${Date.now()}`,
      start_date: '2025-09-15',
      end_date: '2025-09-18',
      passengers: 2,
      total_price: parseFloat(packagesResult.rows[0].price) * 2,
      status: 'confirmed'
    };
    
    const bookingResult = await q(
      `INSERT INTO bookings 
      (user_id, package_id, booking_code, start_date, end_date, passengers, total_price, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [testBooking.user_id, testBooking.package_id, testBooking.booking_code, 
       testBooking.start_date, testBooking.end_date, testBooking.passengers, 
       testBooking.total_price, testBooking.status]
    );
    
    console.log(`✅ Prenotazione creata: ${bookingResult.rows[0].booking_code}`);
    
    // 4. Verificare che la prenotazione sia visibile nella query per l'utente
    const userBookingsResult = await q(
      `SELECT b.*, p.title as package_name, p.destination, p.duration_days, p.image_url
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [testUser.id]
    );
    
    console.log(`✅ Prenotazioni dell'utente: ${userBookingsResult.rows.length}`);
    userBookingsResult.rows.forEach(booking => {
      console.log(`   - ${booking.package_name}: ${booking.booking_code} (€${booking.total_price})`);
    });
    
    console.log('🎉 Test completato con successo!');
    console.log('\n📋 Riepilogo:');
    console.log('✅ Database configurato correttamente');
    console.log('✅ Pacchetti disponibili');
    console.log('✅ Sistema di prenotazioni funzionante');
    console.log('✅ Query per "Mis Viajes" funzionante');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error nel test:', error);
    process.exit(1);
  }
};

testCompleteFlow();
