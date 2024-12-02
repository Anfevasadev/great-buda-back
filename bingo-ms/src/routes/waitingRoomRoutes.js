import express from 'express';
import { getAllWaitingRooms, getWaitingRoomById } from '../controllers/waitingRoomController.js';

const router = express.Router();

router.get('/', getAllWaitingRooms);
router.get('/:id', getWaitingRoomById);

export default router;