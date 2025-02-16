import express from 'express';
import { createPost, getAllPosts, getPostById, deletePost, upload } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware,upload.single('image'), createPost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.delete('/:postId', authMiddleware, deletePost);

export default router;
