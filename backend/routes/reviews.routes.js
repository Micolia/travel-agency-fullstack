import { Router } from 'express';
import { listReviews, createReview } from '../controllers/reviews.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', listReviews);
router.post('/', auth, createReview);

export default router;
