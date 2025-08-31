import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

/**
 * Service class for authentication-related operations.
 */
export class AuthService {
  /**
   * Generates a JWT token for a user.
   * @param {string} userId - The user's unique identifier.
   * @returns {string} - The signed JWT token.
   */
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });
  }

  /**
   * Registers a new user.
   * Checks for existing user by email or username, creates the user, and returns the user and token.
   * @param {string} username - The user's username.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ user: IUser; token: string }>} - The created user and JWT token.
   * @throws {Error} - If a user with the given email or username already exists.
   */
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token for new user
    const token = this.generateToken(user._id.toString());

    return { user, token };
  }

  /**
   * Authenticates a user and returns the user and JWT token.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ user: IUser; token: string }>} - The authenticated user and JWT token.
   * @throws {Error} - If credentials are invalid or password does not match.
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = this.generateToken(user._id.toString());

    return { user, token };
  }
}
