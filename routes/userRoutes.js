const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.post('/register', userController.registerUser); // Register
router.get('/', userController.getAllUsers); // Admin: Get All
router.get('/:email', userController.getUserByEmail); // Single User
router.put('/status-role', userController.updateUserStatusRole); // ✅ Approve/Reject/Role
router.put('/update', userController.updateProfile); // Update Profile
router.put('/suspend', userController.suspendUser); // Suspend
router.delete('/:id', userController.deleteUser); // Delete

module.exports = router;