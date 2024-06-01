const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Order = require('../../models/orderSchema');
const { verifyOnlySalesman, getBooksTotalPrice, changeStatusBooksMongo, putOrderInUser, updateOrderCompradorMongo, updateOrderVendedorMongo } = require('./utils');

const getOrders = async (req, res) => {
    try {
        const { startDate, endDate, estado } = req.query;
        const userId = req.userId;

        let filters = {};

        filters.$or = [
            { comprador: new ObjectId(userId) },
            { vendedor: new ObjectId(userId) }
        ];

        if(startDate || endDate){
            let createdAt = {};

            if (startDate) createdAt.$gte = new Date(startDate);
            if (endDate) createdAt.$lte = new Date(endDate);
            filters.createdAt = createdAt;
        }

        if (estado) filters.estado = estado;

        const orders = await Order.find(filters).populate('comprador vendedor libros_ids');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.userId;

        const order = await Order.findById(orderId).populate('comprador vendedor libros_ids');

        if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

        if (order.comprador._id.toString() !== userId && order.vendedor._id.toString() !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para ver este pedido' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        req.body.comprador = req.userId;
        const { libros_ids } = req.body;
        
        const verifySaleman = await verifyOnlySalesman(libros_ids);

        if (!verifySaleman) return res.status(400).json({ message: 'No puedes comprar libros de diferentes vendedores' });

        req.body.vendedor = verifySaleman;

        if (req.body.comprador.toString() === req.body.vendedor.toString()) return res.status(400).json({ message: 'No puedes comprar tus propios libros' });

        req.body.total = await getBooksTotalPrice(libros_ids);

        const newOrder = new Order(req.body);
        await newOrder.save();

        await changeStatusBooksMongo(libros_ids);
        await putOrderInUser(req.body.comprador, newOrder._id, 0); // 0 para comprador
        await putOrderInUser(req.body.vendedor, newOrder._id, 1); // 1 para vendedor

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { estado } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

        if (!(order.comprador.toString() === req.userId || order.vendedor.toString() === req.userId)) return res.status(403).json({ message: 'No tienes permisos para modificar este pedido' });

        if (estado) {
            if (estado === "cancelar" && order.estado !== "en progreso") {
                res.status(400).json({ message: 'No puedes cancelar un pedido que no está en progreso' });
            }

            const response = order.comprador === req.userId
                ? await updateOrderCompradorMongo(order, estado)
                : await updateOrderVendedorMongo(order, estado);

            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getOrders, getOrder, createOrder, updateOrder};