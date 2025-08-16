import { Router } from 'express';
import { listCartItems, addToCart, removeFromCart } from '../controllers/cart.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', auth, listCartItems);
router.post('/', auth, addToCart);
router.delete('/:id', auth, removeFromCart);

export default router;
