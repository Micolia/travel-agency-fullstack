import { q } from '../config/db.js';

// Crear un post
export const createPost = async (req, res) => {
  try {
    const user_id = req.user?.id; // Otener user_id del token JWT
    const { content, destination, images } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido es obligatorio' });
    }
    
    const result = await q(
      `INSERT INTO community_posts (user_id, content, destination, images, likes_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 0, NOW(), NOW()) RETURNING *`,
      [user_id, content.trim(), destination || null, images ? JSON.stringify(images) : null]
    );
    
    // Obtener información del usuario para la respuesta
    const userInfo = await q(
      'SELECT name as nombre, email FROM users WHERE id = $1',
      [user_id]
    );
    
    const postWithUser = {
      ...result.rows[0],
      user_name: userInfo.rows[0]?.nombre || 'Usuario',
      user_email: userInfo.rows[0]?.email || ''
    };
    
    res.status(201).json(postWithUser);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creando el post' });
  }
};

// Listar todos los posts con información del usuario
export const listPosts = async (_req, res) => {
  try {
    const result = await q(`
      SELECT 
        cp.*,
        u.name as nombre,
        u.email,
        u.name as user_name
      FROM community_posts cp
      LEFT JOIN users u ON cp.user_id = u.id
      ORDER BY cp.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error listing posts:', error);
    res.status(500).json({ message: 'Error obteniendo posts' });
  }
};

// Dar like a un post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    // Incrementar el contador de likes
    const result = await q(
      `UPDATE community_posts 
       SET likes_count = likes_count + 1, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error dando like al post' });
  }
};
