import mongoose from "mongoose";


const connectDB = async()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string, {
            maxPoolSize: 10,        
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("DB NAME:", mongoose.connection.name);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}

export default connectDB;