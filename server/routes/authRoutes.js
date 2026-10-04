import { Router } from 'express';
import { login, getMe, getOrCreateReaderSession } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/reader-session', getOrCreateReaderSession);

export default router;
