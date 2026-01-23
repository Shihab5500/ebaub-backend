// const User = require('../models/User');
// const Post = require('../models/Post');

// // Register User
// exports.registerUser = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // Default status is 'pending' from schema
//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get Single User Info
// exports.getUserByEmail = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get All Users (For Admin - Both Pending & Active)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Approve / Reject User / Change Role
// exports.updateUserStatusRole = async (req, res) => {
//   try {
//     const { id, status, role } = req.body;
//     const updateData = {};
//     if (status) updateData.status = status;
//     if (role) updateData.role = role;

//     const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update Profile
// exports.updateProfile = async (req, res) => {
//     try {
//       const { email, name, photoURL } = req.body;
//       const updatedUser = await User.findOneAndUpdate(
//         { email },
//         { $set: { name, photoURL } },
//         { new: true }
//       );
//       res.json(updatedUser);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// };

// // Suspend User
// exports.suspendUser = async (req, res) => {
//     try {
//       const { id, days } = req.body;
//       let suspensionDate = null;
//       if (days > 0) {
//         const date = new Date();
//         date.setDate(date.getDate() + parseInt(days));
//         suspensionDate = date;
//       }
//       const updatedUser = await User.findByIdAndUpdate(id, { suspensionEndsAt: suspensionDate }, { new: true });
//       res.json(updatedUser);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     await Post.deleteMany({ user: req.params.id });
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const User = require('../models/User');
const Post = require('../models/Post');
const admin = require('firebase-admin');

// 🔥 Firebase Admin SDK Initialization (Deploy Friendly)
let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 🌍 Production: যদি Vercel এ Environment Variable থাকে
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // 🏠 Local: যদি লোকাল পিসিতে ফাইল থাকে
    serviceAccount = require('../serviceAccountKey.json');
  }

  // অ্যাপ যাতে বারবার ইনিশিলাইজ না হয়
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error("⚠️ Firebase Admin Initialization Error:", error.message);
  console.log("Make sure you have 'serviceAccountKey.json' locally or 'FIREBASE_SERVICE_ACCOUNT' env var in production.");
}

// Register User
exports.registerUser = async (req, res) => {
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

// Get All Users (For Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve / Reject / Change Role
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

// 🔥 Delete User (MongoDB + Firebase)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // ১. ডাটাবেস থেকে ইউজার চেক করা
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found in Database" });
    }

    // ২. Firebase থেকে ডিলিট করা
    try {
      if (admin.apps.length) {
        const firebaseUser = await admin.auth().getUserByEmail(user.email);
        await admin.auth().deleteUser(firebaseUser.uid);
        console.log(`✅ Firebase user deleted: ${user.email}`);
      }
    } catch (fbError) {
      // ইউজার ফায়ারবেসে না পেলেও সমস্যা নেই, আমরা ডাটাবেস থেকে ডিলিট চালিয়ে যাব
      console.log("⚠️ Firebase User issue (Not found/Already deleted):", fbError.code);
    }

    // ৩. ইউজারের সব পোস্ট ডিলিট করা
    await Post.deleteMany({ user: userId });

    // ৪. MongoDB থেকে ইউজার ডিলিট করা
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted from Database and Firebase successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
};