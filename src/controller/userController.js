const User = require('../models/userModel');


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

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.find({ email: email });
        if (user.Length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //jWT TOKEN
        const payload = {
            id: user.id
        };

        const token = jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: config.jwtExpire }
        );

        // Get route permissions based on user role
        const allowedRoutes = routePermissions[user.role] || routePermissions.employee;
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            routePermissions: allowedRoutes,
            createdAt: user.createdAt
        };

        res.json({
            message: 'Login successful',
            user: userResponse,
            token
        });


    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
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
    userLogin,
    getUserDetails,
    createUser
}
