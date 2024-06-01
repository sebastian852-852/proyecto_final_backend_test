const { testUser } = require('../utils');
const userController = require('../../src/controllers/auth/auth.controller');
const { verifyPassword, hashPassword } = require('../../src/controllers/auth/utils');
const User = require('../../src/models/userSchema');

jest.mock('../../src/controllers/auth/utils');

const [newUser, ...prevUsers] = testUser;
let insertedUsers = [];

describe('Auth Controller', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        for (let i = 0; i < prevUsers.length; i++) {
            const newUserInstance = new User(prevUsers[i]);
            await newUserInstance.save();
            insertedUsers.push({
                ...newUserInstance.toObject(),
                _id: newUserInstance._id,
                password: prevUsers[i].password,
            });
        }
    });

    afterEach(async () => {
        await User.deleteMany({});
        insertedUsers = [];
    });

    describe('Login', () => {
        it('should get a user token', async () => {

            const req = {
                body: {
                    email: insertedUsers[0].email,
                    password: prevUsers[0].password
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            verifyPassword.mockResolvedValue(true);

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
        });

        it('should not get a user token if the user is not found', async () => {
            const req = {
                body: {
                    email: newUser.email,
                    password: newUser.password
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
        });

        it('should not get a user token if the password is invalid', async () => {
            const req = {
                body: {
                    email: insertedUsers[0].email,
                    password: 'invalidPassword'
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            verifyPassword.mockResolvedValue(false);

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales Invalidas' });
        });
    });

    describe('Register', () => {
        it('should create a new user', async () => {
            const req = {
                body: {
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            hashPassword.mockResolvedValue('hashedPassword123');

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuario registrado exitosamente', user: expect.any(Object) });
        });

        it('should not create a new user if the fields are missing', async () => {
            const req = {
                body: {
                    name: '',
                    email: '',
                    password: ''
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Por favor complete todos los campos' });
        });

        it('should not create a new user if the email is already in use', async () => {
            const req = {
                body: {
                    name: insertedUsers[0].name,
                    email: insertedUsers[0].email,
                    password: insertedUsers[0].password
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El correo ya está registrado" });
        });
    });

    describe('Verify Token', () => {
        it('should verify a token', async () => {
            const req = {
                headers: {
                    authorization: `Bearer ${process.env.TEST_USER_TOKEN}`
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            await userController.verifyToken(req, res, () => {
                res.status(200);
                res.json({ message: 'Token valido' });
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token valido' });
        });

        it('should not verify a token if user not exist', async () => {
            const req = {
                headers: {
                    authorization: `Bearer ${process.env.BAD_TEST_USER_TOKEN}`
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            await userController.verifyToken(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
        });
    })
});