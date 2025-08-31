import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRegister, validateLogin } from "../utils/userValidators";

/**
 * Express router for authentication-related routes.
 * @module auth.routes
 * @description Handles user registration, login, and profile retrieval.
 */
const router = Router();

/**
 * @route POST /register
 * @description Registers a new user.
 * @middleware validateRegister - Validates registration input.
 * @controller AuthController.register
 */
router.post("/register", validateRegister, AuthController.register);

/**
 * @route POST /login
 * @description Authenticates a user and returns a token.
 * @middleware validateLogin - Validates login input.
 * @controller AuthController.login
 */
router.post("/login", validateLogin, AuthController.login);

/**
 * @route GET /profile
 * @description Retrieves the authenticated user's profile.
 * @middleware authenticate - Ensures the user is authenticated.
 * @controller AuthController.getProfile
 */
router.get("/profile", authenticate, AuthController.getProfile);

export default router;
