import { Schema, model } from '../connect';

const userSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    connected_at: { type: Date, required: true }
})

const User = model('users', userSchema);
export default User;