const { testApp } = require('../utils');

const { verifyToken} = require('../../src/controllers/auth/auth.controller');


jest.mock('../../src/controllers/book/books.controller', () => {
    const mockFunctions = {};

    const mockModule = jest.requireActual('../../src/controllers/book/books.controller');

    Object.keys(mockModule).forEach(key => {
        mockFunctions[key] = jest.fn((req, res) => { res.send('Mocked Book controller') });
    });

    return mockFunctions;
});

jest.mock('../../src/controllers/auth/auth.controller', () => ({
    verifyToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn()
}));

describe('Book Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /books', () => {
        it('should get all books', async () => {

            const res = await testApp.get('/api/books').expect(200);

            expect(res.text).toBe('Mocked Book controller');
        });
    });

    describe('GET /books/:id', () => {
        it('should get a book', async () => {

            const res = await testApp.get('/api/books/1').expect(200);

            expect(res.text).toBe('Mocked Book controller');
        });
    });

    describe('POST /books', () => {
        it('should create a book', async () => {

            verifyToken.mockImplementation((req, res, next) => {
                req.userId = { id: 1 };
                next();
            });

            const res = await testApp.post('/api/books').expect(200);

            expect(res.text).toBe('Mocked Book controller');
        });
    });

    describe('PATCH /books/update/:id', () => {
        it('should update a book', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.useId = { id: 1 };
                next();
            });

            const res = await testApp.patch('/api/books/update/1').expect(200);

            expect(res.text).toBe('Mocked Book controller');
        });
    });

    describe('DELETE /books/delete/:id', () => {
        it('should delete a book', async () => {
            verifyToken.mockImplementation((req, res, next) => {
                req.useId = { id: 1 };
                next();
            });

            const res = await testApp.delete('/api/books/delete/1').expect(200);

            expect(res.text).toBe('Mocked Book controller');
        });
    });
});