const { testApp } = require('../utils');
const { verifyToken} = require('../../src/controllers/auth/auth.controller');


jest.mock('../../src/controllers/user/user.controller', () => {
    const mockFunctions = {};

    const mockModule = jest.requireActual('../../src/controllers/user/user.controller');

    Object.keys(mockModule).forEach(key => {
        mockFunctions[key] = jest.fn((req, res) => { res.send('Mocked user controller') });
    });

    return mockFunctions;
});
jest.mock('../../src/controllers/auth/auth.controller', () => ({
    verifyToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn()
}));


describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /user', () => {
        it('should get a user', async () => {

            verifyToken.mockImplementation((req, res, next) => {
                req.user = { id: 1 };
                next();
            });

            const res = await testApp.get('/api/users/1').expect(200);

            expect(res.text).toBe('Mocked user controller');
        });
    });

    describe('PATCH /user/update', () => {
        it('should update a user', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.user = { id: 1 };
                next();
            });

            const res = await testApp.patch('/api/users/update/1').expect(200);

            expect(res.text).toBe('Mocked user controller');
        });
    });

    describe('DELETE /user/delete', () => {
        it('should delete a user', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.user = { id: 1 };
                next();
            });

            const res = await testApp.delete('/api/users/delete/1').expect(200);

            expect(res.text).toBe('Mocked user controller');
        });
    });
});