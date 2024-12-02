import express from 'express';
import { createOrGetActiveGame, deleteAllGames } from '../controllers/gameController.js';

const router = express.Router();

router.post('/play', createOrGetActiveGame);
router.delete('/delete-all', deleteAllGames);

export default router;