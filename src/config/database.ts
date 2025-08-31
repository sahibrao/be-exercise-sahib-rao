import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connect to MongoDB using Mongoose.
 * The connection URI is loaded from the environment variable `MONGODB_URI`,
 * or defaults to a local MongoDB instance if not set.
 * Logs the connection host on success, or exits the process on failure.
 * @async
 * @returns {Promise<void>} Resolves when the connection is established.
 */
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/be-exercise-sahib-rao"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
