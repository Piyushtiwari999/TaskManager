const express = require('express');
const router = express.Router();
const {
  getUsers,
  getRecentActivities,
  getDashboardStats,
  inviteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.post('/invite', protect, admin, inviteUser);
router.get('/activities', protect, getRecentActivities);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
