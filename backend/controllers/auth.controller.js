// controllers/auth.controller.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ------------------ LOGIN ------------------
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

    // 🔹 Extraer "nombre" y "apellido" desde name
    let nombre = null;
    let apellido = null;
    if (user.name) {
      const partes = user.name.split(' ');
      nombre = partes[0];
      apellido = partes.slice(1).join(' ') || '';
    }

    // Respuesta limpia al frontend
    const userResponse = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      nombre,
      apellido,
      nacimiento: user.date_of_birth,
      phone: user.phone,
      profile_image: user.profile_image || null
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el login' });
  }
};

// ------------------ REGISTER ------------------
export const register = async (req, res) => {
  console.log('=== REGISTRO - Datos recibidos ===');
  console.log('Body completo:', req.body);

  const { nombre, apellido, nacimiento, email, password, user_type, phone } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear password
    const password_hash = await bcrypt.hash(password, 10);

    // Combinar nombre + apellido en el campo único "name"
    const fullName = `${nombre || ''} ${apellido || ''}`.trim();

    // Insertar en DB
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, user_type, date_of_birth, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, user_type, date_of_birth, phone, profile_image`,
      [fullName, email, password_hash, user_type || 'traveler', nacimiento || null, phone || null]
    );

    const user = result.rows[0];

    // Extraer nombre y apellido desde "name"
    const [firstName = '', ...lastNameParts] = (user.name || '').split(' ');
    const lastName = lastNameParts.join(' ');

    const userResponse = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      nombre: firstName,
      apellido: lastName,
      nacimiento: user.date_of_birth,
      phone: user.phone,
      profile_image: user.profile_image || null
    };

    // Generar token JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no definido en las variables de entorno');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
};
