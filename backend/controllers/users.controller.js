// controllers/users.controller.js
import { q } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

export const listUsers = async (_req, res) => {
  try {
    const { rows } = await q(
      "SELECT id, email, name, nombre, appellido, user_type, phone, date_of_birth, profile_image, created_at, is_active FROM users"
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};

export const getUser = async (req, res) => {
  try {
    const { rows } = await q(
      "SELECT id, email, name, nombre, appellido, user_type, phone, date_of_birth, profile_image, created_at, is_active FROM users WHERE id = $1",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};

export const createUser = async (req, res) => {
  const { email, password, name, user_type = "traveler", phone, date_of_birth, profile_image } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: "email, password y name son requeridos" });

  try {
    const password_hash = await hashPassword(password);
    const { rows } = await q(
      `INSERT INTO users (email, password_hash, name, user_type, phone, date_of_birth, profile_image)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, email, name`,
      [email, password_hash, name, user_type, phone || null, date_of_birth || null, profile_image || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(400).json({ error: "Email ya registrado" }); // unique_violation
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { name, phone, date_of_birth, profile_image, is_active } = req.body || {};
  try {
    await q(
      `UPDATE users SET name=$1, phone=$2, date_of_birth=$3, profile_image=$4, is_active=$5, updated_at=NOW() WHERE id=$6`,
      [name || null, phone || null, date_of_birth || null, profile_image || null, is_active ?? true, req.params.id]
    );
    res.json({ message: "Usuario actualizado" });
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};

export const deleteUser = async (req, res) => {
  try {
    await q("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "Usuario eliminado" });
  } catch { res.status(500).json({ error: "Error del servidor" }); }
};
// Devuelve los datos del usuario logueado (JWT)
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // viene del middleware auth.js
    const { rows } = await q(
      `SELECT id, email, name, nombre, appellido, user_type, phone, date_of_birth, profile_image, created_at, is_active
       FROM users WHERE id = $1`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  }
};