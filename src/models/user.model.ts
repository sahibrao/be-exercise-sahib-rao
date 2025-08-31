import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Interface representing a User document in MongoDB.
 * @interface IUser
 * @extends Document
 * @property {mongoose.Types.ObjectId} _id - The unique identifier for the user.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's hashed password.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 * @method comparePassword - Compares a candidate password with the user's hashed password.
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise.
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose schema for User documents.
 * Includes validation, unique constraints, and password hashing.
 */
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the user's password before saving to the database.
 * @function
 * @name UserSchema.pre("save")
 * @param {Function} next - Callback to pass control to the next middleware.
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Compares a candidate password with the user's hashed password.
 * @function
 * @name comparePassword
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise.
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Mongoose model for User documents.
 */
export default mongoose.model<IUser>("User", UserSchema);
