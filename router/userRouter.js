import express from 'express';
import { addUser, blockUser, deleteUser, getSingleUser, getUsers, unblockUser, updateUser } from '../controllers/userControllers.js';

const UserRouter = express.Router();

// ✅ Add a new user
UserRouter.post('/add-user', addUser);

// ✅ Get all users (admin only by ID check)
UserRouter.get('/get-users/:id', getUsers);

// ✅ Get single user by ID
UserRouter.get('/get-user/:id', getSingleUser);

// ✅ Delete user by ID
UserRouter.delete('/delete-user/:id', deleteUser);

// ✅ Update user by ID
UserRouter.put('/update-user/:id', updateUser);

// ✅ Block user (cannot block admin)
UserRouter.post('/block-user/:id', blockUser);

// ✅ Unblock user
UserRouter.post('/unblock-user/:id', unblockUser);

export default UserRouter;