const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  console.log('POST /register called');
  console.log('Request body:', req.body);
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    // Simulate login on register by saving user to request
    req.user = userResponse;

    res.status(201).json({ user: userResponse });
  } catch (err) {
    console.error('Registration error:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    req.user = userResponse;

    res.status(200).json({ user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Load user (simulate session)
router.get('/profile', (req, res) => {
  // For production, implement JWT/session auth
  return res.status(200).json({
    user: {
      name: "Demo User",
      email: "demo@example.com"
    }
  });
});

// ✅ Logout route
router.get('/logout', (req, res) => {
  // No real session, just return success
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
