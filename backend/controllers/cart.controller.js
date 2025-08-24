import q from '../config/db.js';

// Listar items del carrito de un usuario
export const listCartItems = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await q(
      'SELECT c.id, c.package_id, c.quantity, p.name, p.price FROM cart c JOIN packages p ON c.package_id = p.id WHERE c.user_id=$1',
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo items del carrito' });
  }
};

// Agregar item al carrito
export const addToCart = async (req, res) => {
  try {
    const { user_id, package_id, quantity } = req.body;

    // Verificar si ya existe en el carrito
    const exists = await q(
      'SELECT * FROM cart WHERE user_id=$1 AND package_id=$2',
      [user_id, package_id]
    );

    if (exists.rows.length) {
      // Actualizar cantidad
      const result = await q(
        'UPDATE cart SET quantity=quantity+$1, updated_at=NOW() WHERE user_id=$2 AND package_id=$3 RETURNING *',
        [quantity, user_id, package_id]
      );
      return res.json(result.rows[0]);
    }

    // Insertar nuevo item
    const result = await q(
      'INSERT INTO cart (user_id, package_id, quantity, created_at) VALUES ($1,$2,$3,NOW()) RETURNING *',
      [user_id, package_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error agregando item al carrito' });
  }
};

// Eliminar item del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // id del item en carrito
    await q('DELETE FROM cart WHERE id=$1', [id]);
    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando item del carrito' });
  }
};
