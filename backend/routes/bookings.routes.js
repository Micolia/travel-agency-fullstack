import { Router } from 'express';
import { listBookings, getBooking, createBooking, updateBooking, deleteBooking, checkoutCart, getMyBookings } from '../controllers/bookings.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', auth, listBookings);
router.get('/my-bookings', auth, getMyBookings); // Obtener reservas del usuario actual
router.post('/checkout', auth, checkoutCart); // Checkout del carrito
router.get('/:id', auth, getBooking);
router.post('/', auth, createBooking);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, deleteBooking);

export default router;
