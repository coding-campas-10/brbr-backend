import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const announceSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    announce_id: { type: Number, required: true, unique: true },
    created_at: { type: Date, required: true, unique: false, index: true, sort: -1, default: Date.now }
});

announceSchema.plugin(autoIncrement.plugin, {
    model : 'announces', 
    field : 'announce_id', 
    startAt : 1, //시작 
    increment : 1 // 증가
});

const announce = mongoose.model('announces', announceSchema);
export default announce;