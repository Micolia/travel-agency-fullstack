import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser, getMe } from '../controllers/users.controller.js';
import auth from '../middleware/auth.js';  // <-- aquí

const router = Router();

router.get('/', listUsers);
// ruta para el usuario logueado - DEBE ir antes de /:id
router.get('/me', auth, getMe);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
