// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // ⚠️ Note: index.js এ '/api' মাউন্ট করা আছে।
// // তাই এখানকার পাথগুলো হবে:

// // 1. Register (Link: /api/register)
// router.post('/register', userController.registerUser); 

// // 2. Users Management (Link: /api/users...)
// router.get('/users', userController.getAllUsers); // ✅ /api/users
// router.get('/users/:email', userController.getUserByEmail); // ✅ /api/users/:email
// router.put('/users/role', userController.updateUserStatusRole); // ✅ /api/users/role
// router.put('/users/update', userController.updateProfile); // ✅ /api/users/update
// router.put('/users/suspend', userController.suspendUser); // ✅ /api/users/suspend
// router.delete('/users/:id', userController.deleteUser); // ✅ /api/users/:id

// module.exports = router;



const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth Routes
router.post('/register', userController.registerUser); // -> /api/register

// User Management Routes
router.get('/users', userController.getAllUsers); // -> /api/users
router.get('/users/:email', userController.getUserByEmail);
router.put('/users/role', userController.updateUserStatusRole); 
router.put('/users/update', userController.updateProfile); 
router.put('/users/suspend', userController.suspendUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;