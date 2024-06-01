const { testUser } = require('../utils');
const userController = require('../../src/controllers/user/user.controller');
const User = require('../../src/models/userSchema');

const [newUser, ...prevUsers] = testUser;
let insertedUsers = [];

describe('User Controller', () => {
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

    describe('Get User', () => {
        it('should get a user', async () => {
            const req = {
                params: { id: insertedUsers[0]._id },
                userId: insertedUsers[0]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not get a user if is not authorized', async () => {
            const req = {
                params: { id: '123' },
                userId: insertedUsers[0]._id
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "No tienes permiso para ver este usuario" });
        });

        it('should not get a user if is already deleted', async () => {
            const req = {
                params: { id: insertedUsers[1]._id },
                userId: insertedUsers[1]._id
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El usuario no existe" });
        });
    });

    describe('Update User', () => {
        it('should update a user', async () => {
            const req = {
                params: { id: insertedUsers[0]._id },
                userId: insertedUsers[0]._id,
                body: { name: "Alice Johnson" }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Alice Johnson" }));
        });

        it('should not update a user if is not authorized', async () => {
            const req = {
                params: { id: '123' },
                userId: insertedUsers[0]._id,
                body: { name: "Bob Johnson" }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "No tienes permiso para actualizar este usuario" });
        });

        it('should not update a user if is already deleted', async () => {
            const req = {
                params: { id: insertedUsers[1]._id },
                userId: insertedUsers[1]._id,
                body: { name: "Bob Johnson" }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El usuario no existe" });
        });
    });

    describe('Delete User', () => {
        it('should delete a user', async () => {
            const req = {
                params: { id: insertedUsers[0]._id },
                userId: insertedUsers[0]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ deleted: true }));
        });

        it('should not delete a user if is not authorized', async () => {
            const req = {
                params: { id: '123' },
                userId: insertedUsers[0]._id
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "No tienes permiso para eliminar este usuario" });
        });

        it('should not delete a user if is already deleted', async () => {
            const req = {
                params: { id: insertedUsers[1]._id },
                userId: insertedUsers[1]._id
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El usuario no existe" });
        });
    });

});