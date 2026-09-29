import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MongoDB connection Failed", error);
        throw error;
    }
};

export default connectDb;