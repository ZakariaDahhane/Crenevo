import express from 'express';
import RoomController from '../controllers/room-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isManager } from '../middlewares/isManager.js';

const router = express.Router();

router.get('/', RoomController.getAll);
router.get('/create', authenticateToken, isManager, RoomController.create);
router.post('/create', authenticateToken, isManager, RoomController.create);
router.get('/:id', RoomController.getById);
router.get('/:id/edit', authenticateToken, isManager, RoomController.update);
router.post('/:id/edit', authenticateToken, isManager, RoomController.update);

export default router;