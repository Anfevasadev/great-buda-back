import express from 'express';
import { createUser, getAllUsers, getUserById } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateUser } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, validateUser, createUser);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);

export default router;
