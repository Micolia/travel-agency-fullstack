import { Router } from 'express';
import { 
  listBookings, 
  getBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking, 
  checkoutCart, 
  getMyBookings,
  cancelBooking 
} from '../controllers/bookings.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, listBookings);
router.get('/my-bookings', auth, getMyBookings);
router.post('/checkout', auth, checkoutCart);
router.get('/:id', auth, getBooking);
router.post('/', auth, createBooking);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, deleteBooking);
router.put('/:id/cancel', auth, cancelBooking);

export default router;
