import q from '../config/db.js';

// Crear un pago
export const createPayment = async (req, res) => {
  try {
    const { booking_id, amount, payment_method, transaction_id } = req.body;

    // Validar que la reserva exista
    const booking = await q('SELECT * FROM bookings WHERE id = $1', [booking_id]);
    if (!booking.rows.length) return res.status(404).json({ message: 'Reserva no encontrada' });

    const result = await q(
      `INSERT INTO payments 
       (booking_id, amount, payment_method, transaction_id, payment_status, payment_date)
       VALUES ($1,$2,$3,$4,'pending', NOW()) RETURNING *`,
      [booking_id, amount, payment_method, transaction_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el pago' });
  }
};

// Listar todos los pagos
export const listPayments = async (_req, res) => {
  try {
    const result = await q('SELECT * FROM payments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo pagos' });
  }
};

// Obtener pago por ID
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('SELECT * FROM payments WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el pago' });
  }
};

// Actualizar estado del pago
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    const validStatus = ['pending','completed','failed','refunded'];

    if (!validStatus.includes(payment_status)) {
      return res.status(400).json({ message: `Estado inválido, debe ser uno de: ${validStatus.join(', ')}` });
    }

    const result = await q(
      `UPDATE payments SET payment_status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [payment_status, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el pago' });
  }
};

// Eliminar pago
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await q('DELETE FROM payments WHERE id=$1', [id]);
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el pago' });
  }
};
