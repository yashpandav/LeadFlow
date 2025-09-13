const User = require('../models/user');
const jwt = require('jsonwebtoken');
const yup = require('yup');

// registration schema
const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one number, and one special character'
    ),
});

// login schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one number, and one special character'
    ),
});

// register user
exports.register = async (req, res) => {
  try {
    await registerSchema.validate(req.body);

    const { name, email, password } = req.body;

    await User.create({ name, email, password });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// login
exports.login = async (req, res) => {
  try {
    await loginSchema.validate(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
