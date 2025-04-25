const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All order routes are protected
router.use(verifyToken);

// User routes
router.post('/', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.get('/', [verifyToken, isAdmin], orderController.getAllOrders);
router.put('/:id/status', [verifyToken, isAdmin], orderController.updateOrderStatus);

module.exports = router; 