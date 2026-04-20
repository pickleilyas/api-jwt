const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/permissionMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('orders', 'read'), getOrders)
  .post(protect, authorize('orders', 'create'), createOrder);

router
  .route('/:id')
  .get(protect, authorize('orders', 'read'), getOrder)
  .put(protect, authorize('orders', 'update'), updateOrder)
  .delete(protect, authorize('orders', 'delete'), deleteOrder);

module.exports = router;
