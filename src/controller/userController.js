const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');


const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('Creating user with data:');
    try {
        const user =  User({
            name,
            email,
            password, // Ensure password is hashed in the User model
            role // Ensure role is set correctly, e.g., 'employee', 'admin', etc.
        });
        await user.save();
        res.status(201).json({mesaage : "User created successfully", user});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

const loginUser = async (req, res) => {
    console.log("User login attempt with data:");
  try {
   

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.id
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

   
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      //routePermissions: allowedRoutes,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
    console.log('User logged in successfully:', userResponse);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
}  


const getUserDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    loginUser,
    getUserDetails,
    createUser
}
