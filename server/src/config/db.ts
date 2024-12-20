import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const MONGO_URI =
    (process.env.MONGO_PROD_URI as string) || "mongodb://localhost:27017/blog-app";
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};
