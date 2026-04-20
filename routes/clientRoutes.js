const express = require('express');
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/permissionMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('clients', 'read'), getClients)
  .post(protect, authorize('clients', 'create'), createClient);

router
  .route('/:id')
  .get(protect, authorize('clients', 'read'), getClient)
  .put(protect, authorize('clients', 'update'), updateClient)
  .delete(protect, authorize('clients', 'delete'), deleteClient);

module.exports = router;
