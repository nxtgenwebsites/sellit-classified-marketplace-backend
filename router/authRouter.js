import express from 'express';
import { resetPassword, sendOtp, signIn, signUp, verifyOtp } from '../controllers/authControllers.js';


const authRouter = express.Router();

// Signup route
authRouter.post('/signup', signUp);

// Login route
authRouter.post('/signin', signIn);

// Send OTP
authRouter.post('/send-otp', sendOtp);

// Verify OTP
authRouter.post('/verify-otp', verifyOtp);

// Reset Password
authRouter.post('/reset-password', resetPassword);

export default authRouter;
