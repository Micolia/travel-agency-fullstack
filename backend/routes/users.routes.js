import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser, getMe } from '../controllers/users.controller.js';
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/authAdmin.js'; // <-- nuevo middleware

const router = Router();

// Ruta para obtener los datos del usuario logueado
router.get('/me', auth, getMe);

// CRUD de usuarios - solo admin puede acceder
router.get('/', authAdmin, listUsers);
router.get('/:id', authAdmin, getUser);
router.post('/', authAdmin, createUser);
router.put('/:id', authAdmin, updateUser);
router.delete('/:id', authAdmin, deleteUser);

export default router;
