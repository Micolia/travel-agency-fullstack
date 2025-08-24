import { Router } from 'express';
import { listServices, createService } from '../controllers/services.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', listServices);
router.post('/', auth, createService); // solo usuarios autenticados pueden crear

export default router;
