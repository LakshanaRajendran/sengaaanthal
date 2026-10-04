import { Router } from 'express';
import {
  getUserBookmarks,
  addBookmark,
  removeBookmark
} from '../controllers/bookmarkController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// All bookmark actions require authentication (reader or admin)
router.get('/', authenticateToken, getUserBookmarks);
router.post('/', authenticateToken, addBookmark);
router.delete('/:poemId', authenticateToken, removeBookmark);

export default router;
