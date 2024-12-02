import express from 'express';
import { createOrGetActiveGame, deleteAllGames } from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/play', verifyToken, createOrGetActiveGame);
router.delete('/delete-all', deleteAllGames);

export default router;