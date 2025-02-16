import express from 'express';
import { toggleLike, getLikeCounts } from '../controllers/likeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, toggleLike);
router.get('/:postId', getLikeCounts);

export default router;
