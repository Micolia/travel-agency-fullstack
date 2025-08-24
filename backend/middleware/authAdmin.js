// middleware/authAdmin.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const authAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en la DB
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Acceso solo para administradores' });
    }

    req.user = user; // guardamos info del usuario en la request
    next();
  } catch (error) {
    console.error('Error en authAdmin:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

export default authAdmin;
