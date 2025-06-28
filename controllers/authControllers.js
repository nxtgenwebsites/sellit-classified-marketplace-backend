import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpModel from "../models/otpModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { OAuth2Client } from 'google-auth-library';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// Helper to generate random password
const randomPassword = () => Math.random().toString(36).slice(-8);

const client = new OAuth2Client('748553911845-pp4s8hkmuntilsvak0ks7t0lv7c4febn.apps.googleusercontent.com');


// user signup
export const signUp = async (req, res) => {
    try {
        const { username, identifier, password } = req.body;

        // Check if user already exists
        const userExists = await userModel.findOne({ identifier });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Check if username already exists
        const usernameExists = await userModel.findOne({ username });

        if (usernameExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            username,
            identifier,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id },
            '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                identifier: newUser.identifier,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
};

// user signin
export const signIn = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ identifier });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                identifier: user.identifier,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Send OTP
export const sendOtp = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ message: "Identifier is required" });
        }

        // Only email allowed
        if (!identifier.includes("@")) {
            return res.status(400).json({
                message: "Mobile OTP service is not available yet.",
            });
        }

        const otp = generateOTP();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        const expiry = Date.now() + 1 * 60 * 1000; // OTP valid for 1 minute

        // Save or Update OTP
        await otpModel.findOneAndUpdate(
            { identifier },
            { otp: hashedOtp, expiresAt: expiry },
            { upsert: true }
        );

        // Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'shahbazansari8199@gmail.com',
                pass: 'xuzp zzno lxpr ocip',
            },
        });

        await transporter.sendMail({
            from: `"Sellit Pakistan"`,
            to: identifier,
            subject: "verify your account",
            text: `Your OTP is ${otp}`,
        });

        res.status(200).json({ message: "OTP sent to your email address." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

// OTP Verify
export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        const record = await otpModel.findOne({ identifier });

        if (!record) {
            return res.status(400).json({ message: "OTP not found" });
        }

        if (Date.now() > record.expiresAt) {
            await otpModel.deleteOne({ identifier });
            return res.status(400).json({ message: "OTP expired, please request a new one." });
        }

        if (record.otp !== hashedOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ Set isActive to true in userModel
        await userModel.findOneAndUpdate(
            { identifier },
            { isActive: true }
        );

        // ✅ Delete OTP after successful verification
        await otpModel.deleteOne({ identifier });

        res.status(200).json({ message: "OTP verified successfully, account activated." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "OTP verification failed" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { identifier, newPassword } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ identifier });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        let user = await userModel.findOne({ email });

        if (!user) {
            const hashedPassword = await randomPassword();

            user = await userModel.create({
                username: name,
                identifier: email, // 👈 add this line
                password: hashedPassword,
                isActive: true,
            });
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ token: jwtToken, user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};