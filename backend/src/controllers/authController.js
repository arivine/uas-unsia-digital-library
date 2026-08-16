import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email sudah terdaftar');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email atau password salah');
  }

  res.status(200).json({
    success: true,
    message: 'Login berhasil',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

export { register, login, getMe };
