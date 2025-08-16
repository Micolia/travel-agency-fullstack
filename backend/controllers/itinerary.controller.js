import q from '../config/db.js';

// Listar todos los itinerarios
export const getItineraries = async (_req, res) => {
  try {
    const result = await q('SELECT * FROM package_itinerary ORDER BY day_number ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo itinerarios' });
  }
};

// Obtener itinerario por ID
export const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('SELECT * FROM package_itinerary WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Itinerario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo itinerario' });
  }
};

// Crear un itinerario
export const createItinerary = async (req, res) => {
  try {
    const { package_id, day_number, day_title, activities } = req.body;
    if (!package_id || !day_number || !day_title || !activities) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await q(
      `INSERT INTO package_itinerary (package_id, day_number, day_title, activities)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [package_id, day_number, day_title, activities]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando itinerario' });
  }
};

// Actualizar itinerario
export const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_number, day_title, activities } = req.body;

    const result = await q(
      `UPDATE package_itinerary
       SET day_number=COALESCE($1,day_number),
           day_title=COALESCE($2,day_title),
           activities=COALESCE($3,activities)
       WHERE id=$4 RETURNING *`,
      [day_number, day_title, activities, id]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'Itinerario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando itinerario' });
  }
};

// Eliminar itinerario
export const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    await q('DELETE FROM package_itinerary WHERE id=$1', [id]);
    res.json({ message: 'Itinerario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando itinerario' });
  }
};
