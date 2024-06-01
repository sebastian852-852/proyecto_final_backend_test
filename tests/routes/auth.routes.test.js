const { testApp } = require('../utils');

jest.mock('../../src/controllers/auth/auth.controller', () => {
    const mockFunctions = {};

    const mockModule = jest.requireActual('../../src/controllers/auth/auth.controller');

    Object.keys(mockModule).forEach(key => {
        mockFunctions[key] = jest.fn((req, res) => { res.send('Mocked user controller') });
    });

    return mockFunctions;
});

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /login', () => {
        it('should login a user', async () => {
            const res = await testApp.post('/api/auth/login').expect(200);

            expect(res.text).toBe('Mocked user controller');
        });
    });

    describe('POST /register', () => {
        it('should register a user', async () => {
            const res = await testApp.post('/api/auth/register').expect(200);

            expect(res.text).toBe('Mocked user controller');
        });
    });
});