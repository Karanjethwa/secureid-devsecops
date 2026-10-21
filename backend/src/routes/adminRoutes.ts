import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes with authentication and admin role check
router.use(authenticateToken, requireAdmin);

router.get('/admin/stats', getAdminStats);
router.get('/admin/users', getUsers);
router.put('/admin/users/:id/status', updateUserStatus);
router.delete('/admin/users/:id', deleteUser);
router.get('/admin/audit-logs', getAuditLogs);

export default router;
