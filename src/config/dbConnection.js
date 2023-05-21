import mongoose from "mongoose";
import { options } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(options.mongo.url);
    console.log("Connected to MongoDB!!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
