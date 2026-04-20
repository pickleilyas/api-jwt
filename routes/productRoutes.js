const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/permissionMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('products', 'read'), getProducts)
  .post(protect, authorize('products', 'create'), createProduct);

router
  .route('/:id')
  .get(protect, authorize('products', 'read'), getProduct)
  .put(protect, authorize('products', 'update'), updateProduct)
  .delete(protect, authorize('products', 'delete'), deleteProduct);

module.exports = router;
