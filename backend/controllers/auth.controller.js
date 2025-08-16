// controllers/auth.controller.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
};

// Registro de usuario
export const register = async (req, res) => {
  const { nombre, appellido, nacimiento, email, password, userType, phone } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear password
    const password_hash = await bcrypt.hash(password, 10);

    // Combinar nombre y apellido para el campo name (retrocompatibilidad)
    const fullName = `${nombre} ${appellido}`;

    // Insertar usuario en la DB con campos separados
    const result = await pool.query(
      `INSERT INTO users (name, nombre, appellido, email, password_hash, user_type, date_of_birth, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, nombre, appellido, email, user_type, date_of_birth, phone`,
      [fullName, nombre, appellido, email, password_hash, userType || 'traveler', nacimiento || null, phone || null]
    );

    const user = result.rows[0];

    // Generar token JWT al registrar
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el registro' });
  }
};
