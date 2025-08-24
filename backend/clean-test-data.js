import { q } from './config/db.js';

const cleanTestData = async () => {
  try {
    console.log('🧹 Pulendo dati di test...');
    
    // Elimina pagamenti di test
    await q("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE booking_code LIKE 'TEST%')");
    console.log('✅ Pagamenti di test eliminati');
    
    // Elimina prenotazioni di test
    await q("DELETE FROM bookings WHERE booking_code LIKE 'TEST%'");
    console.log('✅ Prenotazioni di test eliminate');
    
    console.log('🎉 Pulizia completata!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanTestData();
