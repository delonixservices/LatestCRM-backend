

const Role = require('../models/roleModel');


const createRole = async (req, res) => {
    const { name, permissions } = req.body;

    try {
        // const existingRole = await Role.find({ name });
        // if (existingRole) {
        //     return res.status(400).json({ message: 'Role already exists' });
        // }
        
        const newRole = new Role({
            name,
            permissions
        });


        await newRole.save();
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { createRole };
