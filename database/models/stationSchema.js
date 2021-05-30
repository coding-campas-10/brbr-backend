import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: false },
    station_id: { type: Number, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    location: {
        latitude: { type: Number, required: true, unique: false },
        longitude: { type: Number, required: true, unique: false }
    }
});

stationSchema.plugin(autoIncrement.plugin, {
    model : 'stations', 
    field : 'station_id', 
    startAt : 1, //시작 
    increment : 1 // 증가
});

const stations = mongoose.model('stations', stationSchema);

export default stations;