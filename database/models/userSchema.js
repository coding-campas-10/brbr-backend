import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, //카카오 UID
    name: { type: String, required: true },
    connected_at: { type: Date, required: true },   //최초 가입일
    isAdmin: { type: Boolean, required: true }
});

const User = mongoose.model('users', userSchema);
export default User;