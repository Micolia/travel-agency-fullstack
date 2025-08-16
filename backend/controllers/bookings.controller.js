export const checkoutCart = async (req, res) => {
  try {
    console.log('🛒 Checkout request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);

    const { cart_items } = req.body;
    const user_id = req.user?.id;

    if (!cart_items || cart_items.length === 0) {
      console.log('❌ Cart items empty or missing');
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    if (!user_id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    console.log(`📦 Processing ${cart_items.length} items for user ${user_id}`);

    const bookings = [];
    let total_amount = 0;

    await q('BEGIN');

    try {
      for (const item of cart_items) {
        // ✅ Usa packageId se presente, altrimenti fallback a id
        const package_id = item.packageId || item.id;

        if (!package_id) {
          throw new Error(`packageId/id mancante nell'item del carrello: ${JSON.stringify(item)}`);
        }

        console.log(`🔍 Processing item:`, { 
          cartId: item.id, 
          packageId: package_id,
          title: item.packageTitle
        });

        const packageResult = await q(
          'SELECT price, title, duration_days FROM packages WHERE id = $1', 
          [package_id]
        );
        if (!packageResult.rows.length) {
          throw new Error(`Paquete con ID ${package_id} no encontrado`);
        }

        const package_price = parseFloat(packageResult.rows[0].price);
        const passengers = parseInt(item.bookingDetails.passengers);
        const total_price = package_price * passengers;

        const start_date_str = item.bookingDetails.startDate;
        const end_date_str = item.bookingDetails.endDate;

        const booking_code = `BK${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const bookingResult = await q(
          `INSERT INTO bookings 
          (user_id, package_id, booking_code, start_date, end_date, passengers, total_price, status)
          VALUES ($1,$2,$3,$4::date,$5::date,$6,$7,$8) RETURNING *`,
          [
            user_id,
            package_id,
            booking_code,
            start_date_str,
            end_date_str,
            passengers,
            total_price,
            'confirmed'
          ]
        );

        const booking = bookingResult.rows[0];

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

        bookings.push({
          ...booking,
          package_name: packageResult.rows[0].title,
          payment: paymentResult.rows[0]
        });

        total_amount += total_price;
      }

      await q('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Checkout completado exitosamente',
        bookings,
        total_amount,
        booking_count: bookings.length
      });

    } catch (error) {
      await q('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error procesando el checkout: ' + error.message 
    });
  }
};
