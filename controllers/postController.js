


const Post = require('../models/Post');
const User = require('../models/User'); // ইউজার মডেল ইমপোর্ট করা জরুরি

// Create Post (With Auto-Approval Logic)
exports.createPost = async (req, res) => {
  try {
    const { user, content, category, images, image } = req.body;

    // ১. ইউজার খুঁজে বের করা (রোল চেক করার জন্য)
    const userData = await User.findById(user);
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // ২. লজিক: অ্যাডমিন বা মডারেটর হলে সরাসরি 'approved', সাধারণ ইউজার হলে 'pending'
    let status = 'pending';
    if (userData.role === 'admin' || userData.role === 'moderator') {
      status = 'approved';
    }

    // ৩. পোস্ট সেভ করা
    const newPost = new Post({
      user,
      content,
      category,
      images, 
      image,
      status // অটোমেটিক স্ট্যাটাস বসবে
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... বাকি ফাংশনগুলো আগের মতোই থাকবে (getPublicPosts, getAllPostsAdmin ইত্যাদি) ...
// নিচে বাকিগুলো শর্টকাটে দেওয়া হলো, আপনার ফাইলে এগুলো যেমন ছিল তেমনই রাখবেন।

exports.getPublicPosts = async (req, res) => { /* ... existing code ... */ 
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
exports.getAllPostsAdmin = async (req, res) => { /* ... existing code ... */ 
    try {
        const posts = await Post.find()
          .populate('user', 'name photoURL varsityId email')
          .sort({ createdAt: -1 });
        res.json(posts);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};
exports.getMyPosts = async (req, res) => { /* ... existing code ... */ 
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate('user', 'name photoURL')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updatePostStatus = async (req, res) => { /* ... existing code ... */ 
    try {
        const { status } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(updatedPost);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};
exports.deletePost = async (req, res) => { /* ... existing code ... */ 
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};
exports.reactPost = async (req, res) => { /* ... existing code ... */ 
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
exports.addComment = async (req, res) => { /* ... existing code ... */ 
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
exports.deleteComment = async (req, res) => { /* ... existing code ... */ 
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
exports.updatePostContent = async (req, res) => { /* ... existing code ... */ 
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

// ... আপনার ফাইলের ওপরের সব কোড ঠিক থাকবে ...

// 🔥 এই ফাংশনটি ফাইলের একদম শেষে যুক্ত করুন
exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, text } = req.body;

    // ১. পোস্ট খুঁজে বের করা
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ২. কমেন্ট খুঁজে বের করা
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // ৩. চেক করা: যে এডিট করছে সে-ই কমেন্টের মালিক কিনা
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own comment" });
    }

    // ৪. কমেন্ট আপডেট এবং সেভ করা
    comment.text = text;
    await post.save();

    // ৫. আপডেটেড ডাটা পপুলেট করে ফ্রন্টএন্ডে পাঠানো
    const updatedPost = await Post.findById(postId)
      .populate('user', 'name photoURL varsityId email')
      .populate('comments.user', 'name photoURL');

    res.json(updatedPost);

  } catch (err) {
    console.error("Update Comment Error:", err);
    res.status(500).json({ error: err.message });
  }
};