import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('username').isString().notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('age').isInt({ min: 18 }).withMessage('La edad debe ser un número entero mayor o igual a 18'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('role').isIn(['admin', 'user']).withMessage('El rol debe ser admin o user'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];