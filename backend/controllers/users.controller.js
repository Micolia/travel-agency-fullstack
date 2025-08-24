// controllers/users.controller.js
import { q } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

export const listUsers = async (_req, res) => {
  try {
    const { rows } = await q(
      `SELECT id, email, name, user_type, phone, date_of_birth, profile_image, created_at, is_active 
       FROM users`
    );
    res.json(rows);
  } catch (e) {
    console.error("Error listUsers:", e);
    res.status(500).json({ error: "Error del servidor" });
  }
};



export const getUser = async (req, res) => {
  try {
    const { rows } = await q(
      "SELECT id, email, name, nombre, apellido, user_type, phone, date_of_birth, profile_image, created_at, is_active FROM users WHERE id = $1",
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



// ✅ Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, user_type, phone, date_of_birth, profile_image, is_active } = req.body;

    // Validación estricta: email obligatorio
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    const { rows } = await q(
      `UPDATE users 
       SET name=$1, email=$2, user_type=$3, phone=$4, date_of_birth=$5, profile_image=$6, is_active=$7, updated_at=NOW()
       WHERE id=$8
       RETURNING id, name, email, user_type, phone, date_of_birth, profile_image, is_active`,
      [
        name || null,
        email,
        user_type || 'traveler',
        phone || null,
        date_of_birth || null,
        profile_image || null,
        is_active ?? true,
        id
      ]
    );

    if (!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado con éxito", user: rows[0] });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



// ✅ Eliminar usuario
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
      `SELECT id, email, name, nombre, apellido, user_type, phone, date_of_birth, profile_image, created_at, is_active
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