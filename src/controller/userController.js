const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');


const createUser = async (req, res) => {
  console.log("User creation attempt with data:");
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }


    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


const loginUser = async (req, res) => {
    console.log("User login attempt with data:");
  try {
   

    const { email, password } = req.body;
    console.log("Password:", password);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    hashedPassword = user.password;
    
    console.log("User found:", user.email);
    
    //const isMatch = await user.comparePassword(password);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    console.log("password match status:", isMatch);
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
