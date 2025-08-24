import { q } from "../config/db.js";

// Listar todos los paquetes
export const listPackages = async (_req, res) => {
  try {
    const { rows } = await q(`
      SELECT id, title, description, destination, price, duration_days,
             max_participants, image_url, rating, category,
             start_date, end_date, organizer_id, is_featured, is_active
      FROM packages
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Obtener un paquete por ID
export const getPackage = async (req, res) => {
  try {
    const { rows } = await q(
      `SELECT id, title, description, destination, price, duration_days,
              max_participants, image_url, rating, category,
              start_date, end_date, organizer_id, is_featured, is_active
       FROM packages WHERE id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Paquete no encontrado" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Crear un paquete
export const createPackage = async (req, res) => {
  const {
    title, description, destination, price, duration, duration_days,
    maxParticipants, max_participants, image, image_url, category = 'adventure',
    startDate, start_date, endDate, end_date, services, itinerary,
    organizer_id, is_featured = false, is_active = true
  } = req.body || {};

  // Mapear campos del frontend a campos del backend
  const mappedDuration = duration_days || duration;
  const mappedMaxParticipants = max_participants || maxParticipants;
  const mappedImageUrl = image_url || image;
  const mappedStartDate = start_date || startDate;
  const mappedEndDate = end_date || endDate;
  const mappedOrganizerId = organizer_id || req.user?.id; // Usar el ID del usuario autenticado

  if (!title || !description || !destination || !price || !mappedDuration || !mappedMaxParticipants) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await q(
      `INSERT INTO packages (title, description, destination, price, duration_days,
                              max_participants, image_url, category, start_date, end_date,
                              organizer_id, is_featured, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id, title, destination, price`,
      [title, description, destination, parseFloat(price), parseInt(mappedDuration),
       parseInt(mappedMaxParticipants), mappedImageUrl || null, category, 
       mappedStartDate || null, mappedEndDate || null, mappedOrganizerId || null, 
       is_featured, is_active]
    );
    
    const newPackage = rows[0];
    
    // Si ci sono servizi, salviamoli in una tabella separata (opzionale)
    if (services && Array.isArray(services)) {
      console.log('Servizi da salvare:', services.filter(s => s.trim()));
    }
    
    // Se c'è un itinerario, salviamolo in una tabella separata (opzionale)
    if (itinerary && Array.isArray(itinerary)) {
      console.log('Itinerario da salvare:', itinerary.filter(i => i.activities?.trim()));
    }
    
    res.status(201).json(newPackage);
  } catch (e) {
    console.error('Errore creazione pacchetto:', e);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Actualizar un paquete
export const updatePackage = async (req, res) => {
  const {
    title, description, destination, price, duration_days,
    max_participants, image_url, category, start_date, end_date,
    organizer_id, is_featured, is_active
  } = req.body || {};

  try {
    await q(
      `UPDATE packages SET title=$1, description=$2, destination=$3, price=$4, duration_days=$5,
                           max_participants=$6, image_url=$7, category=$8, start_date=$9, end_date=$10,
                           organizer_id=$11, is_featured=$12, is_active=$13, updated_at=NOW()
       WHERE id=$14`,
      [title || null, description || null, destination || null, price || null, duration_days || null,
       max_participants || null, image_url || null, category || null, start_date || null, end_date || null,
       organizer_id || null, is_featured ?? false, is_active ?? true, req.params.id]
    );
    res.json({ message: "Paquete actualizado" });
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Eliminar un paquete
export const deletePackage = async (req, res) => {
  try {
    await q("DELETE FROM packages WHERE id = $1", [req.params.id]);
    res.json({ message: "Paquete eliminado" });
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
};
