import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    connected_at: { type: Date, required: true }
})

const User = mongoose.model('users', userSchema);
export default User;