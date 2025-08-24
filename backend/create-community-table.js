import { q } from './config/db.js';

const createCommunityTable = async () => {
  try {
    await q(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        destination VARCHAR(100),
        images JSON,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Table community_posts created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating community_posts table:', error);
    process.exit(1);
  }
};

createCommunityTable();
