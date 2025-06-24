import userModel from "../models/userModel.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import otpModel from "../models/otpModel.js";
// import nodemailer from "nodemailer";
// import crypto from "crypto";

// user signup
export const signUp = async (req, res) => {
    const data =  await userModel.find({})
    res.send({message: data})
    // try {
    //     const { username, identifier, password } = req.body;

    //     // Check if user already exists
    //     const userExists = await userModel.findOne({ identifier });

    //     if (userExists) {
    //         return res.status(409).json({ message: 'User already exists' });
    //     }

    //     // Check if username already exists
    //     const usernameExists = await userModel.findOne({ username });

    //     if (usernameExists) {
    //         return res.status(409).json({ message: 'Username already exists' });
    //     }

    //     // Hash password
    //     const salt = await bcrypt.genSalt(10);
    //     const hashedPassword = await bcrypt.hash(password, salt);

    //     // Create new user
    //     const newUser = new userModel({
    //         username,
    //         identifier,
    //         password: hashedPassword,
    //     });

    //     await newUser.save();

    //     // Generate JWT token
    //     const token = jwt.sign(
    //         { id: newUser._id },
    //         '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2',
    //         { expiresIn: '30d' }
    //     );

    //     res.status(201).json({
    //         message: 'User registered successfully',
    //         token,
    //         user: {
    //             id: newUser._id,
    //             username: newUser.username,
    //             identifier: newUser.identifier,
    //         },
    //     });

    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Server error'});
    // }
};

// user signin
// export const signIn = async (req, res) => {
//     try {
//         const { identifier, password } = req.body;

//         // Check if user exists
//         const user = await userModel.findOne({ identifier });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Wrong password' });
//         }

//         // Generate token
//         const token = jwt.sign(
//             { id: user._id },
//             '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2',
//             { expiresIn: '30d' }
//         );

//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 identifier: user.identifier,
//             },
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
// }

// // Send OTP
// export const sendOtp = async (req, res) => {
//     try {
//         const { identifier } = req.body;

//         if (!identifier) {
//             return res.status(400).json({ message: "Identifier is required" });
//         }

//         // Only email allowed
//         if (!identifier.includes("@")) {
//             return res.status(400).json({
//                 message: "Mobile OTP service is not available yet.",
//             });
//         }

//         const otp = generateOTP();
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         const expiry = Date.now() + 1 * 60 * 1000; // OTP valid for 1 minute

//         // Save or Update OTP
//         await otpModel.findOneAndUpdate(
//             { identifier },
//             { otp: hashedOtp, expiresAt: expiry },
//             { upsert: true }
//         );

//         // Send Email
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: 'shahbazansari8199@gmail.com',
//                 pass: 'xuzp zzno lxpr ocip',
//             },
//         });

//         await transporter.sendMail({
//             from: `"Sellit Pakistan"`,
//             to: identifier,
//             subject: "verify your account",
//             text: `Your OTP is ${otp}`,
//         });

//         res.status(200).json({ message: "OTP sent to your email address." });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to send OTP" });
//     }
// };

// export const verifyOtp = async (req, res) => {
//     try {
//         const { identifier, otp } = req.body;

//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
//         const record = await otpModel.findOne({ identifier });

//         if (!record) {
//             return res.status(400).json({ message: "OTP not found" });
//         }

//         if (Date.now() > record.expiresAt) {
//             await otpModel.deleteOne({ identifier });
//             return res.status(400).json({ message: "OTP expired, please request a new one." });
//         }

//         if (record.otp !== hashedOtp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         // ✅ Set isActive to true in userModel
//         await userModel.findOneAndUpdate(
//             { identifier },
//             { isActive: true }
//         );

//         // ✅ Delete OTP after successful verification
//         await otpModel.deleteOne({ identifier });

//         res.status(200).json({ message: "OTP verified successfully, account activated." });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "OTP verification failed" });
//     }
// };