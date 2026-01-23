const Post = require('../models/Post');
const User = require('../models/User');

// Create Post (Default status: pending)
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get PUBLIC Posts (Only Approved) - For Home Page
exports.getPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' })
      .populate('user', 'name photoURL varsityId email')
      .populate('comments.user', 'name photoURL')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ALL Posts (For Admin/Mod - Pending, Approved, Rejected)
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name photoURL varsityId email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get MY Posts (For Dashboard - All Status)
exports.getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate('user', 'name photoURL')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Approve / Reject Post
exports.updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle Reaction
exports.reactPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const { userId, type } = req.body;
      const existingReactionIndex = post.reactions.findIndex(r => r.user.toString() === userId);
      if (existingReactionIndex !== -1) {
        if (post.reactions[existingReactionIndex].type === type) {
          post.reactions.splice(existingReactionIndex, 1);
        } else {
          post.reactions[existingReactionIndex].type = type;
        }
      } else {
        post.reactions.push({ user: userId, type });
      }
      await post.save();
      const updatedPost = await Post.findById(req.params.id)
        .populate('user', 'name photoURL varsityId email')
        .populate('comments.user', 'name photoURL');
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Add Comment
exports.addComment = async (req, res) => {
    try {
      const { userId, text } = req.body;
      const post = await Post.findById(req.params.id);
      post.comments.push({ user: userId, text });
      await post.save();
      const updatedPost = await Post.findById(req.params.id)
        .populate('user', 'name photoURL')
        .populate('comments.user', 'name photoURL');
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(postId);
      const requestingUser = await User.findById(userId);
  
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (comment.user.toString() === userId || requestingUser.role === 'admin' || requestingUser.role === 'moderator') {
        post.comments.pull(commentId);
        await post.save();
        const updatedPost = await Post.findById(postId)
          .populate('user', 'name photoURL')
          .populate('comments.user', 'name photoURL');
        res.json(updatedPost);
      } else {
        res.status(403).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Edit Post Content
exports.updatePostContent = async (req, res) => {
    try {
      const { content } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content }, { new: true })
        .populate('user', 'name photoURL')
        .populate('comments.user', 'name photoURL');
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};