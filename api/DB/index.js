import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
const connectDB = async ()=> {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('DataBase is connected')
    } catch (error) {
        console.log("MongDB connection Failed", error);
        process.exit(1)
    }
}

export default connectDB