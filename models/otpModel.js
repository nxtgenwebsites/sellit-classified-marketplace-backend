import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true },  // email or phone
    otp: { type: String, required: true },         // hashed OTP
    expiresAt: { type: Date, required: true },     // expiry timestamp
});


const otpModel = mongoose.model('otp-codes', otpSchema);

export default otpModel;
