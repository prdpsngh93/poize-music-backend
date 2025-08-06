const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is in .env

    // Attach user to request
    const user = await User.findByPk(decoded.id); // assuming token payload has { id: user.id }

    if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = authMiddleware;
