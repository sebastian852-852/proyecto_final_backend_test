const { testApp } = require('../utils');

const { verifyToken} = require('../../src/controllers/auth/auth.controller');


jest.mock('../../src/controllers/order/order.controller', () => {
    const mockFunctions = {};

    const mockModule = jest.requireActual('../../src/controllers/order/order.controller');

    Object.keys(mockModule).forEach(key => {
        mockFunctions[key] = jest.fn((req, res) => { res.send('Mocked order controller') });
    });

    return mockFunctions;
});
jest.mock('../../src/controllers/auth/auth.controller', () => ({
    verifyToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn()
}));

describe('Order Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /order', () => {
        it('should get a order', async () => {

            verifyToken.mockImplementation((req, res, next) => {
                req.userId = { id: 1 };
                next();
            });

            const res = await testApp.get('/api/orders/1').expect(200);

            expect(res.text).toBe('Mocked order controller');
        });
    });

    describe('PATCH /order/update', () => {
        it('should update a order', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.userId = { id: 1 };
                next();
            });

            const res = await testApp.patch('/api/orders/update/1').expect(200);

            expect(res.text).toBe('Mocked order controller');
        });
    });

    describe('POST /order', () => {
        it('should create a order', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.userId = { id: 1 };
                next();
            });

            const res = await testApp.post('/api/orders').expect(200);

            expect(res.text).toBe('Mocked order controller');
        });
    });
});