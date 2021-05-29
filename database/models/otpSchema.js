import mongoose from 'mongoose';

const otpSchema = mongoose.model('QR_OTPs', new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    otp_code: { type: String, required: true },
    createdAt: { type: Date, required: true, expires: 20 }
    })
);

export default otpSchema;