/**
 * Main application entry point.
 * Sets up Express app, middleware, routes, and error handling.
 * @module app
 */

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

/**
 * Express application instance.
 */
const app: Application = express();

/**
 * Port number for the server to listen on.
 */
const PORT = process.env.PORT || 3000;

/**
 * Middleware setup for security, CORS, and request parsing.
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Route handlers for authentication and todos.
 */
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

/**
 * Error handling middleware for catching and formatting errors.
 */
app.use(errorHandler);

/**
 * Starts the Express server after connecting to the database.
 * Handles startup errors gracefully.
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

/**
 * Exports the Express app instance for testing or external usage.
 */
export default app;
