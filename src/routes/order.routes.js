const { Router } = require('express');
const { verifyToken } = require('../controllers/auth/auth.controller');
const { getOrders, getOrder, createOrder, updateOrder } = require('../controllers/order/order.controller');

const router = Router();

router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrder);
router.post("/", verifyToken, createOrder);
router.patch("/update/:id", verifyToken, updateOrder);

module.exports = router;