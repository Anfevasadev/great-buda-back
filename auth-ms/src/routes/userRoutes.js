import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; 

const router = express.Router();

router.post('/users', async (req, res) => {
  const { username, name, age, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
      username,
      name,
      age,
      email,
      password_hash: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
});

export default router;
