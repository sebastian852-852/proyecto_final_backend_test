const { testOrder, testBook, testUser } = require('../utils');
const orderController = require('../../src/controllers/order/order.controller');
const Order = require('../../src/models/orderSchema');
const User = require('../../src/models/userSchema');
const Book = require('../../src/models/bookSchema');
const { query } = require('express');

let [newOrder, ...prevOrders] = testOrder;
let insertedOrders = [];
let insertedUsers = [];
let insertedBooks = [];

describe('Order Controller', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        insertedUsers = await User.insertMany([testUser[0], testUser[1]]);
        testBook[0].propietario = insertedUsers[0]._id;
        testBook[1].propietario = insertedUsers[0]._id;
        insertedBooks = await Book.insertMany(testBook);
        newOrder.libros_ids = [insertedBooks[0]._id, insertedBooks[1]._id];
        newOrder.vendedor = insertedUsers[0]._id;
        newOrder.comprador = insertedUsers[1]._id;
        let newPrevOrders = prevOrders.map(order => {
            order.libros_ids = [insertedBooks[0]._id, insertedBooks[1]._id];
            order.vendedor = insertedUsers[0]._id;
            order.comprador = insertedUsers[1]._id;
            return order;
        });
        insertedOrders = await Order.insertMany(newPrevOrders);
    });

    afterEach(async () => {
        await Order.deleteMany({});
        await User.deleteMany({});
        await Book.deleteMany({});
        insertedOrders = [];
        insertedUsers = [];
        insertedBooks = [];
    });

    describe('Create Order', () => {
        it('should create an order', async () => {
            const req = {
                body: newOrder,
                userId: insertedUsers[1]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not create an order with diferents salesmans', async () => {
            const req = {
                body: { ...newOrder, libros_ids: [insertedBooks[0]._id, insertedBooks[2]._id] },
                userId: insertedUsers[1]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'No puedes comprar libros de diferentes vendedores' });
        });

        it('should not create an order if the buyer is the seller', async () => {

            const req = {
                body: newOrder,
                userId: insertedUsers[0]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'No puedes comprar tus propios libros' });
        });
    });

    describe('Get Orders', () => {
        it('should get orders', async () => {
            const req = {
                userId: insertedUsers[0]._id,
                query: {}
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.getOrders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });

        it('should not get an order if user is not authorized', async () => {
            const req = {
                params: { id: insertedOrders[0]._id },
                userId: insertedUsers[1]._id
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.getOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para ver este pedido' });
        });

        it('should get order by id', async () => {
            const req = {
                params: { id: insertedOrders[0]._id },
                query: {},
                userId: insertedUsers[0]._id.toString()
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.getOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('Update Order', () => {
        it('should update an order', async () => {
            const req = {
                params: { id: insertedOrders[0]._id },
                body: { estado: 'cancelar' },
                userId: insertedUsers[1]._id.toString()
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not update an order with invalid status', async () => {
            const req = {
                params: { id: insertedOrders[1]._id },
                body: { estado: 'cancelar' },
                userId: insertedUsers[1]._id.toString()
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'No puedes cancelar un pedido que no está en progreso' });
        });

        it('should not update an order if user is not authorized', async () => {
            const req = {
                params: { id: insertedOrders[0]._id },
                body: { estado: 'cancelar' },
                userId: "60d0fe4f5311236168a109cd"
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            await orderController.updateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para modificar este pedido' });
        });
    });

});