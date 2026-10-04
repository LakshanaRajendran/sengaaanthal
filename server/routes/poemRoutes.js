import { Router } from 'express';
import {
  getPublishedPoems,
  getPublishedPoemById,
  getAllPoemsAdmin,
  createPoem,
  updatePoem,
  deletePoem,
  publishPoem,
  unpublishPoem,
  getAdminStats
} from '../controllers/poemController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

// Public Reader endpoints
router.get('/', getPublishedPoems);

// Admin-only endpoints (placed before /:id)
router.get('/all', authenticateToken, requireAdmin, getAllPoemsAdmin);
router.get('/stats', authenticateToken, requireAdmin, getAdminStats);
router.post('/', authenticateToken, requireAdmin, createPoem);
router.put('/:id', authenticateToken, requireAdmin, updatePoem);
router.delete('/:id', authenticateToken, requireAdmin, deletePoem);
router.patch('/:id/publish', authenticateToken, requireAdmin, publishPoem);
router.patch('/:id/unpublish', authenticateToken, requireAdmin, unpublishPoem);

// Public Reader endpoint for single poem
router.get('/:id', getPublishedPoemById);

export default router;
