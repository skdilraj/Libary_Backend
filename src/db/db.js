import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.MONGODB_URI);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("MongoDB connected at:", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB