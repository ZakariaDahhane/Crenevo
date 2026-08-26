import express from 'express';
import RoomController from '../controllers/room-controller.js';

const router = express.Router();

router.get('/', RoomController.getAll);
router.get('/create', RoomController.create);
router.post('/create', RoomController.create);
router.get('/:id', RoomController.getById);
router.get('/:id/edit', RoomController.update);
router.post('/:id/edit', RoomController.update);

export default router;