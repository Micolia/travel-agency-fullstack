import q from '../config/db.js';

// Crear una reseña
export const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;

    // Validar que la reserva exista
    const booking = await q('SELECT * FROM bookings WHERE id = $1', [booking_id]);
    if (!booking.rows.length) return res.status(404).json({ message: 'Reserva no encontrada' });

    const result = await q(
      `INSERT INTO reviews (booking_id, rating, comment, created_at)
       VALUES ($1,$2,$3,NOW()) RETURNING *`,
      [booking_id, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando la reseña' });
  }
};

// Listar todas las reseñas
export const listReviews = async (_req, res) => {
  try {
    const result = await q('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo reseñas' });
  }
};

// Obtener reseña por ID
export const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('SELECT * FROM reviews WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo la reseña' });
  }
};

// Actualizar reseña
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const result = await q(
      `UPDATE reviews SET rating=$1, comment=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [rating, comment, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando la reseña' });
  }
};

// Eliminar reseña
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await q('DELETE FROM reviews WHERE id=$1', [id]);
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando la reseña' });
  }
};
