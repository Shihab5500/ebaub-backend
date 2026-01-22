

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000; // ✅ Port Defined Here

// // Middleware
// app.use(express.json());

// // CORS Setup (For Vercel & Localhost)
// app.use(cors({
//   origin: [
//     "http://localhost:5173", 
//     "https://ebaub-frontend.vercel.app", // আপনার ফ্রন্টএন্ড লাইভ লিংক (পরিবর্তন করতে পারেন)
//   ],
//   credentials: true
// }));

// // --- 1. MongoDB Connection ---
// const uri = process.env.MONGO_URI;

// mongoose.connect(uri)
//   .then(() => console.log("✅ MongoDB Connected Successfully!"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // --- 2. Schema Models ---
// // User Schema
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   varsityId: { type: String, required: true },
//   department: { type: String, required: true },
//   batch: { type: String, required: true },
//   photoURL: { type: String },
//   uid: { type: String, required: true },
//   role: { type: String, default: 'user' }, 
//   suspensionEndsAt: { type: Date, default: null },
//   createdAt: { type: Date, default: Date.now }
// });

// // Post Schema
// const PostSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   image: { type: String },
//   category: { type: String, required: true },
//   reactions: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     type: { type: String, required: true } 
//   }],
//   comments: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     text: String,
//     createdAt: { type: Date, default: Date.now }
//   }],
// }, { timestamps: true });

// const User = mongoose.model('User', UserSchema);
// const Post = mongoose.model('Post', PostSchema);

// // --- 3. API Routes ---

// // ✅ Default Route (To Check Server Status)
// app.get('/', (req, res) => {
//   res.send('EBAUB Fun Hub Server is Running 🚀');
// });

// // A. Register User
// app.post('/api/register', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // B. Get User Info
// app.get('/api/users/:email', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // C. Create Post
// app.post('/api/posts', async (req, res) => {
//   try {
//     const newPost = new Post(req.body);
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // D. Get All Posts
// app.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('user', 'name photoURL varsityId email')
//       .populate('comments.user', 'name photoURL')
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // E. Update User Profile
// app.put('/api/users/update', async (req, res) => {
//   try {
//     const { email, name, photoURL } = req.body;
//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { $set: { name, photoURL } },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // F. Get All Users (Admin)
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // G. Change User Role (Admin)
// app.put('/api/users/role', async (req, res) => {
//   try {
//     const { id, role } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // H. Suspend User (Admin)
// app.put('/api/users/suspend', async (req, res) => {
//   try {
//     const { id, days } = req.body;
//     let suspensionDate = null;
//     if (days > 0) {
//       const date = new Date();
//       date.setDate(date.getDate() + parseInt(days));
//       suspensionDate = date;
//     }
//     const updatedUser = await User.findByIdAndUpdate(id, { suspensionEndsAt: suspensionDate }, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // I. Delete User (Admin)
// app.delete('/api/users/:id', async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     await Post.deleteMany({ user: req.params.id });
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // J. Handle Reactions
// app.put('/api/posts/:id/react', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     const { userId, type } = req.body;

//     const existingReactionIndex = post.reactions.findIndex(r => r.user.toString() === userId);

//     if (existingReactionIndex !== -1) {
//       if (post.reactions[existingReactionIndex].type === type) {
//         post.reactions.splice(existingReactionIndex, 1);
//       } else {
//         post.reactions[existingReactionIndex].type = type;
//       }
//     } else {
//       post.reactions.push({ user: userId, type });
//     }

//     await post.save();
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // K. Add Comment
// app.post('/api/posts/:id/comment', async (req, res) => {
//   try {
//     const { userId, text } = req.body;
//     const post = await Post.findById(req.params.id);
//     post.comments.push({ user: userId, text });
//     await post.save();
//     const updatedPost = await Post.findById(req.params.id)
//       .populate('user', 'name photoURL')
//       .populate('comments.user', 'name photoURL');
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // L. Delete Comment
// app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const { userId } = req.body;

//     const post = await Post.findById(postId);
//     const requestingUser = await User.findById(userId);

//     if (!post || !requestingUser) return res.status(404).json({ message: "Not found" });

//     const comment = post.comments.id(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     if (
//       comment.user.toString() === userId ||
//       requestingUser.role === 'admin' ||
//       requestingUser.role === 'moderator'
//     ) {
//       post.comments.pull(commentId);
//       await post.save();
      
//       const updatedPost = await Post.findById(postId)
//         .populate('user', 'name photoURL')
//         .populate('comments.user', 'name photoURL');
//       res.json(updatedPost);
//     } else {
//       res.status(403).json({ message: "Unauthorized" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // L-2. Edit Comment
// app.put('/api/posts/:postId/comments/:commentId', async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const { userId, text } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const comment = post.comments.id(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     if (comment.user.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     comment.text = text;
//     await post.save();

//     const updatedPost = await Post.findById(postId)
//       .populate('user', 'name photoURL varsityId email')
//       .populate('comments.user', 'name photoURL');

//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // M. Edit Post Content
// app.put('/api/posts/:id', async (req, res) => {
//   try {
//     const { content } = req.body;
//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content }, { new: true })
//       .populate('user', 'name photoURL')
//       .populate('comments.user', 'name photoURL');
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // N. Delete Post
// app.delete('/api/posts/:id', async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // --- Server Start (For Vercel & Localhost) ---

// // ✅ Export App for Vercel
// module.exports = app;

// // ✅ Start Server locally if not in production (Vercel handles production start automatically)
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(port, () => {
//     console.log(`🚀 Server is running on port: ${port}`);
//   });
// }



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000; // ✅ Port Defined Here

// // Middleware
// app.use(express.json());

// // CORS Setup (For Vercel & Localhost)
// app.use(cors({
//   origin: [
//     "http://localhost:5173", 
//     "https://ebaub-frontend.vercel.app", // আপনার ফ্রন্টএন্ড লাইভ লিংক (পরিবর্তন করতে পারেন)
//   ],
//   credentials: true
// }));

// // --- 1. MongoDB Connection ---
// const uri = process.env.MONGO_URI;

// mongoose.connect(uri)
//   .then(() => console.log("✅ MongoDB Connected Successfully!"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // --- 2. Schema Models ---
// // User Schema
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   varsityId: { type: String, required: true },
//   department: { type: String, required: true },
//   batch: { type: String, required: true },
//   photoURL: { type: String },
//   uid: { type: String, required: true },
//   role: { type: String, default: 'user' }, 
//   suspensionEndsAt: { type: Date, default: null },
//   createdAt: { type: Date, default: Date.now }
// });

// // Post Schema
// const PostSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   image: { type: String },
//   category: { type: String, required: true },
//   reactions: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     type: { type: String, required: true } 
//   }],
//   comments: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     text: String,
//     createdAt: { type: Date, default: Date.now }
//   }],
// }, { timestamps: true });

// const User = mongoose.model('User', UserSchema);
// const Post = mongoose.model('Post', PostSchema);

// // --- 3. API Routes ---

// // ✅ Default Route (To Check Server Status)
// app.get('/', (req, res) => {
//   res.send('EBAUB Fun Hub Server is Running 🚀');
// });

// // A. Register User
// app.post('/api/register', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // B. Get User Info
// app.get('/api/users/:email', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // C. Create Post
// app.post('/api/posts', async (req, res) => {
//   try {
//     const newPost = new Post(req.body);
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // D. Get All Posts
// app.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('user', 'name photoURL varsityId email')
//       .populate('comments.user', 'name photoURL')
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // E. Update User Profile
// app.put('/api/users/update', async (req, res) => {
//   try {
//     const { email, name, photoURL } = req.body;
//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { $set: { name, photoURL } },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // F. Get All Users (Admin)
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // G. Change User Role (Admin)
// app.put('/api/users/role', async (req, res) => {
//   try {
//     const { id, role } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // H. Suspend User (Admin)
// app.put('/api/users/suspend', async (req, res) => {
//   try {
//     const { id, days } = req.body;
//     let suspensionDate = null;
//     if (days > 0) {
//       const date = new Date();
//       date.setDate(date.getDate() + parseInt(days));
//       suspensionDate = date;
//     }
//     const updatedUser = await User.findByIdAndUpdate(id, { suspensionEndsAt: suspensionDate }, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // I. Delete User (Admin)
// app.delete('/api/users/:id', async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     await Post.deleteMany({ user: req.params.id });
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // J. Handle Reactions (✅ FIXED: Added Populate)
// app.put('/api/posts/:id/react', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     const { userId, type } = req.body;

//     const existingReactionIndex = post.reactions.findIndex(r => r.user.toString() === userId);

//     if (existingReactionIndex !== -1) {
//       if (post.reactions[existingReactionIndex].type === type) {
//         post.reactions.splice(existingReactionIndex, 1);
//       } else {
//         post.reactions[existingReactionIndex].type = type;
//       }
//     } else {
//       post.reactions.push({ user: userId, type });
//     }

//     await post.save();
    
//     // 🔥 FIX: ডাটা সেভ করার পর ইউজারের তথ্যসহ পোস্টটি আবার আনা হচ্ছে
//     const updatedPost = await Post.findById(req.params.id)
//       .populate('user', 'name photoURL varsityId email')
//       .populate('comments.user', 'name photoURL');

//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // K. Add Comment
// app.post('/api/posts/:id/comment', async (req, res) => {
//   try {
//     const { userId, text } = req.body;
//     const post = await Post.findById(req.params.id);
//     post.comments.push({ user: userId, text });
//     await post.save();
//     const updatedPost = await Post.findById(req.params.id)
//       .populate('user', 'name photoURL')
//       .populate('comments.user', 'name photoURL');
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // L. Delete Comment
// app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const { userId } = req.body;

//     const post = await Post.findById(postId);
//     const requestingUser = await User.findById(userId);

//     if (!post || !requestingUser) return res.status(404).json({ message: "Not found" });

//     const comment = post.comments.id(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     if (
//       comment.user.toString() === userId ||
//       requestingUser.role === 'admin' ||
//       requestingUser.role === 'moderator'
//     ) {
//       post.comments.pull(commentId);
//       await post.save();
      
//       const updatedPost = await Post.findById(postId)
//         .populate('user', 'name photoURL')
//         .populate('comments.user', 'name photoURL');
//       res.json(updatedPost);
//     } else {
//       res.status(403).json({ message: "Unauthorized" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // L-2. Edit Comment
// app.put('/api/posts/:postId/comments/:commentId', async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     const { userId, text } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const comment = post.comments.id(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     if (comment.user.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     comment.text = text;
//     await post.save();

//     const updatedPost = await Post.findById(postId)
//       .populate('user', 'name photoURL varsityId email')
//       .populate('comments.user', 'name photoURL');

//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // M. Edit Post Content
// app.put('/api/posts/:id', async (req, res) => {
//   try {
//     const { content } = req.body;
//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content }, { new: true })
//       .populate('user', 'name photoURL')
//       .populate('comments.user', 'name photoURL');
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // N. Delete Post
// app.delete('/api/posts/:id', async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // --- Server Start (For Vercel & Localhost) ---

// // ✅ Export App for Vercel
// module.exports = app;

// // ✅ Start Server locally if not in production (Vercel handles production start automatically)
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(port, () => {
//     console.log(`🚀 Server is running on port: ${port}`);
//   });
// }


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // ✅ Port Defined Here

// Middleware
app.use(express.json());

// CORS Setup (For Vercel & Localhost)
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://ebaub-frontend.vercel.app", 
  ],
  credentials: true
}));

// --- 1. MongoDB Connection ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. Schema Models ---
// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  varsityId: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  photoURL: { type: String },
  uid: { type: String, required: true },
  role: { type: String, default: 'user' }, 
  suspensionEndsAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Post Schema
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  
  // ✅ UPDATE: অনেকগুলো ছবির জন্য Array যোগ করা হয়েছে
  images: { type: [String], default: [] }, 
  image: { type: String }, // পুরনো পোস্টের জন্য এটাও থাকবে

  category: { type: String, required: true },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true } 
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. API Routes ---

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('EBAUB Fun Hub Server is Running 🚀');
});

// A. Register User
app.post('/api/register', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// B. Get User Info
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// C. Create Post
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// D. Get All Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name photoURL varsityId email')
      .populate('comments.user', 'name photoURL')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// E. Update User Profile
app.put('/api/users/update', async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name, photoURL } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// F. Get All Users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// G. Change User Role (Admin)
app.put('/api/users/role', async (req, res) => {
  try {
    const { id, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// H. Suspend User (Admin)
app.put('/api/users/suspend', async (req, res) => {
  try {
    const { id, days } = req.body;
    let suspensionDate = null;
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(days));
      suspensionDate = date;
    }
    const updatedUser = await User.findByIdAndUpdate(id, { suspensionEndsAt: suspensionDate }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// I. Delete User (Admin)
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ user: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// J. Handle Reactions
app.put('/api/posts/:id/react', async (req, res) => {
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
    
    // 🔥 Populated Data Return
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'name photoURL varsityId email')
      .populate('comments.user', 'name photoURL');

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// K. Add Comment
app.post('/api/posts/:id/comment', async (req, res) => {
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
});

// L. Delete Comment
app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    const requestingUser = await User.findById(userId);

    if (!post || !requestingUser) return res.status(404).json({ message: "Not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() === userId ||
      requestingUser.role === 'admin' ||
      requestingUser.role === 'moderator'
    ) {
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
});

// L-2. Edit Comment
app.put('/api/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.text = text;
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate('user', 'name photoURL varsityId email')
      .populate('comments.user', 'name photoURL');

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// M. Edit Post Content
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content }, { new: true })
      .populate('user', 'name photoURL')
      .populate('comments.user', 'name photoURL');
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// N. Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Server Start (For Vercel & Localhost) ---
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
  });
}