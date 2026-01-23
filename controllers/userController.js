const User = require('../models/User');
const Post = require('../models/Post');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Default status is 'pending' from schema
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single User Info
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users (For Admin - Both Pending & Active)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve / Reject User / Change Role
exports.updateUserStatusRole = async (req, res) => {
  try {
    const { id, status, role } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
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
};

// Suspend User
exports.suspendUser = async (req, res) => {
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
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ user: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};