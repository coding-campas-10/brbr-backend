import mongoose from 'mongoose';

const otpSchema = mongoose.model('barcode-otps', new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    otp_code: { type: String, required: true },
    createdAt: { type: Date, required: true, expires: 30, default: Date.now}
    })
);

export default otpSchema;