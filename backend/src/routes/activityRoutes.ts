import { Router } from 'express';
import { getActivityList, getActivityById } from '../controllers/activityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/activity', authenticateToken, getActivityList);
router.get('/activity/:id', authenticateToken, getActivityById);

export default router;
