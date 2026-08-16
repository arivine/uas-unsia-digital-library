import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Token tidak valid, pengguna tidak ditemukan');
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Token tidak valid atau sudah kedaluwarsa'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Token tidak ditemukan, akses ditolak'));
  }
};

export default protect;
