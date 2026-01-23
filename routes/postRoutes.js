const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes
router.post('/', postController.createPost);
router.get('/', postController.getPublicPosts); 
router.get('/admin/all', postController.getAllPostsAdmin); // 🔥 এই লাইনটি থাকতে হবে
router.get('/user/:userId', postController.getMyPosts);
router.put('/:id/status', postController.updatePostStatus);
router.put('/:id', postController.updatePostContent);
router.delete('/:id', postController.deletePost);
router.put('/:id/react', postController.reactPost);
router.post('/:id/comment', postController.addComment);
router.delete('/:postId/comments/:commentId', postController.deleteComment);

module.exports = router;