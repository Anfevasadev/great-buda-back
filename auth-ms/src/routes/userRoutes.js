import express from 'express';
import { createUser, getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users/create', createUser);
router.get('/users/:id', getUserById);

export default router;
