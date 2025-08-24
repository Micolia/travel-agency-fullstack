import pool from './config/db.js';

const alterTable = async () => {
  try {
    // Aggiungi colonne per nome e cognome separati
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS nombre VARCHAR(100),
      ADD COLUMN IF NOT EXISTS appellido VARCHAR(100);
    `);
    
    console.log('✅ Colonne nombre e appellido aggiunte con successo!');
    
    // Verifica le nuove colonne
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('nombre', 'appellido')
      ORDER BY column_name;
    `);
    
    console.log('Nuove colonne:');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

alterTable();
