import { filterUser } from '../../src/utils/filterUser.js';

describe('filterUser', () => {
    it('should return an object with only id, username, name, age, and email properties', () => {
        const user = {
            id: 1,
            username: 'john_doe',
            name: 'John Doe',
            age: 30,
            email: 'john.doe@example.com',
            password: 'hashed_password',
            address: '123 Main St',
        };
        const filteredUser = filterUser(user);
        expect(filteredUser).toEqual({
            id: 1,
            username: 'john_doe',
            name: 'John Doe',
            age: 30,
            email: 'john.doe@example.com',
        });
    });

    it('should not include properties that are not id, username, name, age, or email', () => {
        const user = {
            id: 2,
            username: 'jane_doe',
            name: 'Jane Doe',
            age: 25,
            email: 'jane.doe@example.com',
            password: 'hashed_password',
            phone: '555-555-5555',
        };
        const filteredUser = filterUser(user);
        expect(filteredUser).not.toHaveProperty('password');
        expect(filteredUser).not.toHaveProperty('phone');
    });

    it('should return an object with undefined properties if they are not present in the input', () => {
        const user = {
            id: 3,
            username: 'sam_smith',
        };
        const filteredUser = filterUser(user);
        expect(filteredUser).toEqual({
            id: 3,
            username: 'sam_smith',
            name: undefined,
            age: undefined,
            email: undefined,
        });
    });

    it('should handle an empty object input', () => {
        const user = {};
        const filteredUser = filterUser(user);
        expect(filteredUser).toEqual({
            id: undefined,
            username: undefined,
            name: undefined,
            age: undefined,
            email: undefined,
        });
    });
});