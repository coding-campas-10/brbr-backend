import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config('../');
mongoose.Promise = global.Promise;

mongoose
    .connect(process.env.MONGODB_URI , {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch((err) => {
        console.log(err);
    });

export default mongoose;