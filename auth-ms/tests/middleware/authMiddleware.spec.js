import { verifyToken } from '../../src/middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('verifyToken Middleware', () => {
    it('should return 403 if no token is provided', () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    });

    it('should return 401 if token is invalid', () => {
        const req = { headers: { authorization: 'invalid_token' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jwt.verify = jest.fn(() => { throw new Error('Token no válido'); });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token no válido', error: expect.any(Error) });
    });

    it('should call next if token is valid', () => {
        const req = { headers: { authorization: 'valid_token' } };
        const res = {};
        const next = jest.fn();

        jwt.verify = jest.fn(() => ({ id: 1, role: 'user' }));

        verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: 1, role: 'user' });
    });

    it('should handle expired token', () => {
        const req = { headers: { authorization: 'expired_token' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jwt.verify = jest.fn(() => { throw new jwt.TokenExpiredError('Token expired', new Date()); });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token no válido', error: expect.any(jwt.TokenExpiredError) });
    });

    it('should handle malformed token', () => {
        const req = { headers: { authorization: 'malformed_token' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jwt.verify = jest.fn(() => { throw new jwt.JsonWebTokenError('Malformed token'); });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token no válido', error: expect.any(jwt.JsonWebTokenError) });
    });
});