import mongoose from 'mongoose';
import dotenv from 'dotenv';
import autoIncrement from 'mongoose-auto-increment';

dotenv.config('../');
mongoose.Promise = global.Promise;
autoIncrement.initialize(mongoose.connection);

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