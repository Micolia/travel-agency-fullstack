import pool from './config/db.js';

const testDB = async () => {
  try {
    // Probar conexión y obtener la hora actual
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a la base de datos:', result.rows[0]);

    // Opcional: listar todos los usuarios
    const users = await pool.query('SELECT id, email, name FROM users');
    console.log('Usuarios en la DB:', users.rows);

    process.exit(0); // salir del script
  } catch (error) {
    console.error('❌ Error conectando a la DB:', error);
    process.exit(1);
  }
};

testDB();
