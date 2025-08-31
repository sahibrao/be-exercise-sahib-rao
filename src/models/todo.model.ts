import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Interface representing a Todo document in MongoDB.
 * @interface ITodo
 * @extends Document
 * @property {string} title - The title of the todo item.
 * @property {string} description - The description of the todo item.
 * @property {"pending" | "in-progress" | "completed"} status - The status of the todo.
 * @property {"low" | "medium" | "high"} priority - The priority level of the todo.
 * @property {Date} [dueDate] - Optional due date for the todo.
 * @property {Types.ObjectId} owner - Reference to the user who owns the todo.
 * @property {Date} createdAt - Timestamp when the todo was created.
 * @property {Date} updatedAt - Timestamp when the todo was last updated.
 */
export interface ITodo extends Document {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Todo documents.
 * Includes validation, default values, and indexes for search and filtering.
 */
const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Adds a text index on title and description for search functionality.
 * Adds a compound index on owner and status for efficient filtering.
 */
TodoSchema.index({ title: "text", description: "text" });
TodoSchema.index({ owner: 1, status: 1 });

/**
 * Mongoose model for Todo documents.
 */
export default mongoose.model<ITodo>("Todo", TodoSchema);
