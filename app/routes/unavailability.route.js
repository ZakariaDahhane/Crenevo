import express from 'express';
import UnavailabilityController from '../controllers/unavailability-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isManager } from '../middlewares/isManager.js';

const router = express.Router();

router.get('/', UnavailabilityController.getAll);
router.get('/create', authenticateToken, isManager, UnavailabilityController.showCreate);
router.post('/create', authenticateToken, isManager, UnavailabilityController.createUnavailability);
router.post('/:id/delete', authenticateToken, isManager, UnavailabilityController.deleteUnavailability);

export default router;