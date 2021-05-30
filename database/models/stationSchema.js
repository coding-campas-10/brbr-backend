import mongoose from 'mongoose';

const stationSchema = mongoose.model('stations', new mongoose.Schema({
    name: { type: String, required: true, unique: false },
    stationID: { type: Number, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    location: {
        latitude: { type: Number, required: true, unique: false },
        longitude: { type: Number, required: true, unique: false }
    }
}));

export default stationSchema;