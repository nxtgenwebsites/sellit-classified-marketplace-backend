import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    identifier: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role:{
        type: String,
        default: 'user'
    },
    isActive: { 
    type: Boolean, 
    default: false 
},
    isBlocked: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
