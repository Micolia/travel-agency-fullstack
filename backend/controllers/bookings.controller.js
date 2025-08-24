import { q } from '../config/db.js';

// checkout cart
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
        const package_id = item.packageId || item.id;

        if (!package_id) {
          throw new Error(`packageId/id mancante: ${JSON.stringify(item)}`);
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

// ✅ Get all bookings
export const listBookings = async (req, res) => {
  try {
    const result = await q('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// ✅ Get booking by ID
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('SELECT * FROM bookings WHERE id = $1', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { user_id, package_id, start_date, end_date, passengers, total_price } = req.body;

    const result = await q(
      `INSERT INTO bookings 
      (user_id, package_id, booking_code, start_date, end_date, passengers, total_price, status) 
      VALUES ($1,$2,$3,$4::date,$5::date,$6,$7,$8) RETURNING *`,
      [
        user_id,
        package_id,
        `BK${Date.now().toString().slice(-8)}`,
        start_date,
        end_date,
        passengers,
        total_price,
        'pending'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// ✅ Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, passengers, status } = req.body;

    const result = await q(
      `UPDATE bookings SET start_date=$1, end_date=$2, passengers=$3, status=$4 
       WHERE id=$5 RETURNING *`,
      [start_date, end_date, passengers, status, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// ✅ Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('DELETE FROM bookings WHERE id=$1 RETURNING *', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
};

// ✅ Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    // Verify that the booking belongs to the user
    const booking = await q('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [id, user_id]);

    if (!booking.rows.length) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Update the booking status to cancelled
    const result = await q(
      'UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      ['cancelled', id, user_id]
    );

    if (!result.rows.length) {
      return res.status(400).json({ message: 'No se pudo cancelar la reserva' });
    }

    res.json({ message: 'Reserva cancelada con éxito', booking: result.rows[0] });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Error al cancelar la reserva' });
  }
};

// ✅ Get bookings for logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await q(`
      SELECT 
        b.id,
        b.booking_code,
        b.start_date,
        b.end_date,
        b.passengers,
        b.total_price,
        b.status,
        b.special_requests,
        b.created_at,
        p.title as package_name,
        p.destination,
        p.image_url,
        p.duration_days,
        pay.payment_status,
        pay.transaction_id,
        pay.payment_method
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN payments pay ON b.id = pay.booking_id
      WHERE b.user_id = $1 
      ORDER BY b.created_at DESC
    `, [user_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
};
