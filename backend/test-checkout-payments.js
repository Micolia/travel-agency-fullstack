import { q } from './config/db.js';

const testCheckoutWithPayments = async () => {
  try {
    console.log('🧪 Test checkout completo con pagamenti');
    
    // Simula il payload del checkout dal frontend
    const cart_items = [
      {
        id: 1, // Package ID
        bookingDetails: {
          startDate: '2025-09-15',
          endDate: '2025-09-18',
          passengers: 2
        }
      }
    ];
    
    const user_id = 2; // User ID di test
    
    console.log('📦 Processando checkout...');
    
    // Simula il processo di checkout
    const bookings = [];
    let total_amount = 0;

    await q('BEGIN');

    try {
      for (const item of cart_items) {
        // Verificar que el paquete existe
        const packageResult = await q('SELECT price, title FROM packages WHERE id = $1', [item.id]);
        if (!packageResult.rows.length) {
          throw new Error(`Paquete con ID ${item.id} no encontrado`);
        }

        const package_price = parseFloat(packageResult.rows[0].price);
        const passengers = parseInt(item.bookingDetails.passengers);
        const total_price = package_price * passengers;
        
        const booking_code = `BK${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Crear la reserva
        const bookingResult = await q(
          `INSERT INTO bookings 
          (user_id, package_id, booking_code, start_date, end_date, passengers, total_price, status)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
          [
            user_id,
            item.id,
            booking_code,
            item.bookingDetails.startDate,
            item.bookingDetails.endDate,
            passengers,
            total_price,
            'confirmed'
          ]
        );

        const booking = bookingResult.rows[0];
        console.log(`✅ Prenotazione creata: ${booking.booking_code}`);

        // Crear el pago correspondiente
        const transaction_id = `TXN${Date.now().toString().slice(-10)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        const paymentResult = await q(
          `INSERT INTO payments 
          (booking_id, amount, payment_method, payment_status, transaction_id, payment_date)
          VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
          [
            booking.id,
            total_price,
            'credit_card',
            'completed',
            transaction_id
          ]
        );

        console.log(`💳 Pagamento creato: ${paymentResult.rows[0].transaction_id}`);

        bookings.push({
          ...booking,
          package_name: packageResult.rows[0].title,
          payment: paymentResult.rows[0]
        });

        total_amount += total_price;
      }

      await q('COMMIT');
      console.log('✅ Transazione completata');

      // Verifica il risultato finale
      console.log(`\n📋 Risultato checkout:`);
      console.log(`- Prenotazioni create: ${bookings.length}`);
      console.log(`- Importo totale: €${total_amount}`);
      
      bookings.forEach(booking => {
        console.log(`- ${booking.package_name}: ${booking.booking_code} (€${booking.total_price})`);
        console.log(`  Pagamento: ${booking.payment.transaction_id} - ${booking.payment.payment_status}`);
      });

      // Verifica query per "Mis Viajes"
      console.log('\n🔍 Verifica query "Mis Viajes":');
      const userBookingsResult = await q(
        `SELECT b.*, p.title as package_name, p.destination, p.duration_days, p.image_url,
                pay.payment_status, pay.payment_method, pay.transaction_id, pay.payment_date
         FROM bookings b
         JOIN packages p ON b.package_id = p.id
         LEFT JOIN payments pay ON b.id = pay.booking_id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [user_id]
      );
      
      console.log(`✅ Prenotazioni trovate: ${userBookingsResult.rows.length}`);
      userBookingsResult.rows.forEach(booking => {
        console.log(`- ${booking.package_name}: €${booking.total_price} - Pago: ${booking.payment_status}`);
      });

      console.log('\n🎉 Test completato con successo!');
      
    } catch (error) {
      await q('ROLLBACK');
      throw error;
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error nel test:', error);
    process.exit(1);
  }
};

testCheckoutWithPayments();
