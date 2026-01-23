

// const express = require('express');
// const router = express.Router();
// const postController = require('../controllers/postController');

// // Base path in index.js is '/api/posts'
// router.post('/', postController.createPost); 
// router.get('/', postController.getPublicPosts); 
// router.get('/admin/all', postController.getAllPostsAdmin); // -> /api/posts/admin/all
// router.get('/user/:userId', postController.getMyPosts);
// router.put('/:id/status', postController.updatePostStatus);
// router.put('/:id', postController.updatePostContent);
// router.delete('/:id', postController.deletePost);
// router.put('/:id/react', postController.reactPost);
// router.post('/:id/comment', postController.addComment);
// router.delete('/:postId/comments/:commentId', postController.deleteComment);

// module.exports = router;


const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Base path in index.js is '/api/posts'

// Create & Get Posts
router.post('/', postController.createPost); 
router.get('/', postController.getPublicPosts); 
router.get('/admin/all', postController.getAllPostsAdmin); 
router.get('/user/:userId', postController.getMyPosts);

// Post Operations
router.put('/:id/status', postController.updatePostStatus);
router.put('/:id', postController.updatePostContent); // Post Edit Route
router.delete('/:id', postController.deletePost);
router.put('/:id/react', postController.reactPost);

// Comment Operations
router.post('/:id/comment', postController.addComment);

// 🔥 NEW: Update Comment Route (এটি আপনার মিসিং ছিল)
router.put('/:postId/comments/:commentId', postController.updateComment);

router.delete('/:postId/comments/:commentId', postController.deleteComment);

module.exports = router;