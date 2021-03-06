import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config('../');

const receiptSchema = new mongoose.Schema({
    station_id: { type: Number, required: true, unique: false },
    station_name: { type: String, required: true, unique: false },

    plastic_weight: { type: Number, required: false, unique: false },
    paper_weight: { type: Number, required: false, unique: false },
    glass_weight: { type: Number, required: false, unique: false },
    styrofoam_weight: { type: Number, required: false, unique: false },
    etc_weight: { type: Number, required: false, unique: false },

    point: { type: Number, required: true, unique: false },
    transaction_at: {
        type: Date, 
        require: true, 
        index: true, 
        expires: 
        parseInt(process.env.RECEIPT_EXPIRE) ,
        default: Date.now
    },
});

const walletSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    total_points: { type: Number, required: false, unique: false, default: 0 },

    receipts: [receiptSchema]   //subdocument
});

const wallets = mongoose.model('wallets', walletSchema);
export default wallets;