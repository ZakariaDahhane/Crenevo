import express from 'express';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import ReservationController from '../controllers/reservation-controller.js';

const router = express.Router();

router.get('/', authenticateToken, ReservationController.getUserReservations);
router.get('/create', authenticateToken, ReservationController.showCreate);
router.post('/create', authenticateToken, ReservationController.createReservation);

export default router;