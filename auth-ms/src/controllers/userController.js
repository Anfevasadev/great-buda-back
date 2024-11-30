import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { body, validationResult } from 'express-validator';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

export const createUser = [
  body('username').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('age').isInt({ min: 18 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['admin', 'user']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];