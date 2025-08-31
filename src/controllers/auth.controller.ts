import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

/**
 * Controller for authentication-related endpoints.
 */
export class AuthController {
  /**
   * Registers a new user.
   * @param {Request} req - Express request object containing username, email, and password in the body.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const { user, token } = await AuthService.register(
        username,
        email,
        password
      );

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Logs in an existing user.
   * @param {Request} req - Express request object containing email and password in the body.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { user, token } = await AuthService.login(email, password);

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Retrieves the profile of the authenticated user.
   * @param {Request} req - Express request object with authenticated user attached.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    res.json({
      user: {
        id: req.user!._id,
        username: req.user!.username,
        email: req.user!.email,
      },
    });
  }
}
