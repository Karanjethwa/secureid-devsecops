import { Router } from 'express';
import { register, login, logout, getSession } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validateMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', authRateLimiter, validateRegister, register);
router.post('/login', authRateLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/session', authenticateToken, getSession);

export default router;
