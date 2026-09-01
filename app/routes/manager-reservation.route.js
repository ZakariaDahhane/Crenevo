import express from 'express';
import ReservationController from '../controllers/reservation-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isManager } from '../middlewares/isManager.js';

const router = express.Router();

router.get('/', authenticateToken, isManager, ReservationController.getAllManager);
router.post('/:id/confirm', authenticateToken, isManager, ReservationController.confirmReservation);
router.post('/:id/reject', authenticateToken, isManager, ReservationController.rejectReservation);

export default router;
