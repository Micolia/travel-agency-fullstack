import pool from './config/db.js';
import bcrypt from 'bcrypt';

const createTestUser = async () => {
  try {
    const email = 'admin@ejemplo.com';
    const password = '123456'; // contraseña en texto plano que usarás para login
    const name = 'Administrador';
    
    // Generar hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, user_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
       RETURNING id, email, name`,
      [email, password_hash, name, 'admin']
    );

    console.log('✅ Usuario de prueba creado o actualizado:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
    process.exit(1);
  }
};

createTestUser();
