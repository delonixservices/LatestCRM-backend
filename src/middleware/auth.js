const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Make sure to import your User model

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      
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

const isAdmin = (req, res, next) => {
  if (req.user   && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Forbidden, admin access required' 
    });
  }
}

module.exports = { protect , isAdmin };