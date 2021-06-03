import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config('../');

const otpSchema = mongoose.model('barcode-otps', new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    otp_code: { type: String, required: true },
    created_at: { type: Date, required: true, expires: parseInt(process.env.OTP_EXPIRE), default: Date.now}
}));

export default otpSchema;