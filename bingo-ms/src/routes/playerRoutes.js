import express from 'express';
import { joinGame } from '../controllers/playerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/join', verifyToken, joinGame);

export default router;