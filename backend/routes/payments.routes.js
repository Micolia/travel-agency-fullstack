import { Router } from 'express';
import { listPayments, createPayment } from '../controllers/payments.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', auth, listPayments);
router.post('/', auth, createPayment);

export default router;
