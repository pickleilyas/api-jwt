const express = require('express');
const { register, login, updateUserRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/register', protect, register);
router.post('/login', login);
router.put('/users/:id/role', protect, requireAdmin, updateUserRole);

module.exports = router;