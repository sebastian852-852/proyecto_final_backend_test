const { testBook, testUser } = require('../utils');
const bookController = require('../../src/controllers/book/books.controller');
const Book = require('../../src/models/bookSchema');
const User = require('../../src/models/userSchema');

const [newBook, ...prevBooks] = testBook;

let insertedUser = {};

let insertedBooks = [];

describe('Book Controller', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        user = new User(testUser[3]);
        insertedUser = await user.save();

        insertedBooks = await Book.insertMany(prevBooks);
    });

    afterEach(async () => {
        await Book.deleteMany({});
        await User.deleteMany({});
        insertedUser = {};
        insertedBooks = [];
    });

    describe('Create Book', () => {
        it('should create a book', async () => {
            const req = {
                body: newBook,
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not create a product with invalid data', async () => {
            const req = {
                body: {},
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Por favor complete todos los campos" });
        });

        it('should not create a product if user is not authorized', async () => {
            const req = {
                body: newBook,
                userId: '5f8d0a7d8b0c0a2a1c9d4c9e'
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "Usuario no autorizado" });
        });
    });

    describe('Get Books', () => {
        it('should get all books', async () => {
            const req = {
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.getBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ books: expect.any(Array), numBooks: expect.any(Number) });
        });

        it('should get a book by id', async () => {
            const req = {
                params: { id: insertedBooks[0]._id },
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.getBook(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should get books with filters', async () => {
            const req = {
                query: { autor: 'George Orwell' },
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.getBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ books: expect.any(Array), numBooks: expect.any(Number) });
        });
    });

    describe('Update Book', () => {
        it('should update a book', async () => {
            const req = {
                params: { id: insertedBooks[0]._id },
                body: { titulo: 'New Title' },
                userId: '60d0fe4f5311236168a109cb'
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not update a book if is not found', async () => {
            const req = {
                params: { id: '5f8d0a7d8b0c0a2a1c9d4c9e' },
                body: { titulo: 'New Title' },
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Libro no encontrado" });
        });

        it('should not update a book if is not authorized', async () => {
            const req = {
                params: { id: insertedBooks[0]._id },
                body: { titulo: 'New Title' },
                userId: '5f8d0a7d8b0c0a2a1c9d4c9e'
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "No puedes editar este libro" });
        });
    });

    describe('Delete Book', () => {
        it('should delete a book', async () => {
            const req = {
                params: { id: insertedBooks[0]._id },
                userId: '60d0fe4f5311236168a109cb'
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ book: expect.objectContaining({disponible:false}), message: "Libro eliminado" });
        });

        it('should not delete a book if is not found', async () => {
            const req = {
                params: { id: '5f8d0a7d8b0c0a2a1c9d4c9e' },
                userId: insertedUser._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Libro no encontrado" });
        });

        it('should not delete a book if is not authorized', async () => {
            const req = {
                params: { id: insertedBooks[0]._id },
                userId: '5f8d0a7d8b0c0a2a1c9d4c9e'
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "No puedes eliminar este libro" });
        });
    });
});