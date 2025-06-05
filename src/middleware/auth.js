const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Make sure to import your User model

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      // More specific error messages
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Not authorized, invalid token' 
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Not authorized, token expired' 
        });
      }
      
      res.status(401).json({ 
        message: 'Not authorized, authentication failed' 
      });
    }
  }

  if (!token) {
    res.status(401).json({ 
      message: 'Not authorized, no token provided' 
    });
  }
};

module.exports = { protect };