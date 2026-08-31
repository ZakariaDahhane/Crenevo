import express from 'express';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import ReservationController from '../controllers/reservation-controller.js';

const router = express.Router();

router.get('/create', authenticateToken, ReservationController.showCreate);

export default router;