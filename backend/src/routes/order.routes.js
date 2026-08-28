const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { createOrderController, updOrderStatusController, getOrdersByUserController, getOrderByStandController } = require('../controllers/order.controller');
const router = express.Router();

router.post('/', authenticate, authorize('customer'), createOrderController)
router.patch('/:id/status', authenticate, authorize('seller'), updOrderStatusController)
router.get('/my', authenticate, getOrdersByUserController)
router.get('/stand', authenticate, getOrderByStandController)

module.exports=router