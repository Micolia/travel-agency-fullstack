// controllers/services.controller.js
import { q } from "../config/db.js";

export const listServices = async (req, res) => {
  try {
    const { rows } = await q("SELECT * FROM package_services WHERE package_id = $1", [req.params.id]);
    res.json(rows);
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};

export const addService = async (req, res) => {
  const { service_name, service_type } = req.body || {};
  try {
    const { rows } = await q(
      "INSERT INTO package_services (package_id, service_name, service_type) VALUES ($1,$2,$3) RETURNING id, service_name",
      [req.params.id, service_name, service_type]
    );
    res.status(201).json(rows[0]);
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};
export const createService = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price) return res.status(400).json({ error: "name y price son requeridos" });

  try {
    const { rows } = await q(
      `INSERT INTO services (name, description, price)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description || null, price]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  }
};