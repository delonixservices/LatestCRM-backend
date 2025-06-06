const User = require('../models/userModel');



getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

