import { Router } from 'express';
import {
  getSecurityStats,
  getSecurityAlerts,
  simulateSuspiciousLogin,
  getSecurityAnalysis,
} from '../controllers/securityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/security/stats', authenticateToken, getSecurityStats);
router.get('/security/alerts', authenticateToken, getSecurityAlerts);
router.post('/security/simulate-suspicious', authenticateToken, simulateSuspiciousLogin);
router.get('/security-analysis', authenticateToken, getSecurityAnalysis);

export default router;
