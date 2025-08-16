import q from '../config/db.js';

// Crear un post
export const createPost = async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const result = await q(
      `INSERT INTO posts (user_id, content, created_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [user_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el post' });
  }
};

// Listar todos los posts
export const listPosts = async (_req, res) => {
  try {
    const result = await q('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo posts' });
  }
};

// Dar like a un post
export const likePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    // Evitar likes duplicados
    const exists = await q(
      'SELECT * FROM post_likes WHERE post_id=$1 AND user_id=$2',
      [post_id, user_id]
    );
    if (exists.rows.length) return res.status(400).json({ message: 'Ya le diste like a este post' });

    await q(
      'INSERT INTO post_likes (post_id, user_id, created_at) VALUES ($1,$2,NOW())',
      [post_id, user_id]
    );

    // Contar total de likes
    const total = await q('SELECT COUNT(*) FROM post_likes WHERE post_id=$1', [post_id]);
    res.json({ post_id, likes: parseInt(total.rows[0].count, 10) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error dando like al post' });
  }
};
