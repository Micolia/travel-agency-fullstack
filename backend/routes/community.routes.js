import { Router } from 'express';
import { listPosts, createPost, likePost } from '../controllers/community.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', listPosts);
router.post('/', auth, createPost);
router.post('/:id/like', auth, likePost);

export default router;
