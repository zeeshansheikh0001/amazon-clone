const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;

// Register a new user
exports.register = async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use!" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address || '',
      phone: req.body.phone || ''
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'ecommerce_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'ecommerce_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Update profile fields
    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    // If password is being updated
    if (req.body.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    await user.save();

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 