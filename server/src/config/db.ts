import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI =
    (process.env.MONGO_URI as string) || "mongodb://localhost:27017/blog-app";
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};
