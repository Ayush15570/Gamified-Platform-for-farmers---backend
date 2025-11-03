import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      
    });
    console.log("MongoDB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(error); // logs full error
    process.exit(1);
  }
}

export default connectDB;
