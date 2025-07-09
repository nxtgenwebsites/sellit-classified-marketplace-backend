import userModel from "../models/userModel.js";

// GET all users only if requested by an admin
export const getUsers = async (req, res) => {
    const { id } = req.params; 

    try {
        // Find the user making the request
        const checkAdmin = await userModel.findById(id);

        // Check if user exists and is an admin
        if (!checkAdmin || checkAdmin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        // If admin, get all users
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET single user by ID
export const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id).select('-password'); // optional: hide password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
//  Update a new user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, identifier, password, role, isActive } = req.body;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        if (username !== undefined) user.username = username;
        if (identifier !== undefined) user.identifier = identifier;
        if (password !== undefined) user.password = password;
        if (role !== undefined) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//  Add a new user
export const addUser = async (req, res) => {
    const { username, identifier, password, role, isActive } = req.body;

    try {
        // Check if identifier or username already exists
        const existingUser = await userModel.findOne({
            $or: [{ identifier }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new userModel({
            username,
            identifier,
            password, // Hash this before saving in real applications
            role: role || 'user',
            isActive: isActive || false,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const blockUser = async (req, res) => {
    const { id: adminId } = req.params; // Admin ID from route params
    const { userId } = req.body;        // User ID to be blocked from request body

    try {
        // Check if requester is a valid admin
        const admin = await userModel.findById(adminId);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can block users' });
        }

        // Find user to be blocked
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin users cannot be blocked' });
        }

        if (user.isBlocked) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: 'User has been blocked successfully', user });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const unblockUser = async (req, res) => {
    const { id: adminId } = req.params;  // Admin ID
    const { userId } = req.body;         // User to unblock

    try {
        // Check if admin is valid
        const admin = await userModel.findById(adminId);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can unblock users' });
        }

        // Find the user to unblock
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isBlocked) {
            return res.status(400).json({ message: 'User is already unblocked' });
        }

        user.isBlocked = false;
        await user.save();

        res.status(200).json({ message: 'User has been unblocked successfully', user });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};