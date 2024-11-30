import request from 'supertest';
import express from 'express';
import { validateUser } from '../../src/middleware/validationMiddleware.js';

const app = express();
app.use(express.json());
app.post('/api/users', validateUser, (req, res) => {
    res.status(200).json({ message: 'User is valid' });
});

describe('validateUser Middleware', () => {
    it('should return 400 if username is missing', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: 'John Doe', age: 25, email: 'john.doe@example.com', password: 'password123', role: 'user' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'El nombre de usuario es obligatorio' })
        ]));
    });

    it('should return 400 if name is missing', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', age: 25, email: 'john.doe@example.com', password: 'password123', role: 'user' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'El nombre es obligatorio' })
        ]));
    });

    it('should return 400 if age is less than 18', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', name: 'John Doe', age: 17, email: 'john.doe@example.com', password: 'password123', role: 'user' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'La edad debe ser un número entero mayor o igual a 18' })
        ]));
    });

    it('should return 400 if email is invalid', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', name: 'John Doe', age: 25, email: 'invalid_email', password: 'password123', role: 'user' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'El correo electrónico no es válido' })
        ]));
    });

    it('should return 400 if password is less than 8 characters', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', name: 'John Doe', age: 25, email: 'john.doe@example.com', password: 'short', role: 'user' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'La contraseña debe tener al menos 8 caracteres' })
        ]));
    });

    it('should return 400 if role is not admin or user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', name: 'John Doe', age: 25, email: 'john.doe@example.com', password: 'password123', role: 'invalid_role' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'El rol debe ser admin o user' })
        ]));
    });

    it('should return 200 if all fields are valid', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'johndoe', name: 'John Doe', age: 25, email: 'john.doe@example.com', password: 'password123', role: 'user' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User is valid' });
    });
});