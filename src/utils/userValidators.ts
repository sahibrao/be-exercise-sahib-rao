import { Request, Response, NextFunction } from "express";

/**
 * Sends validation errors as a 400 response.
 * @param res Express response object
 * @param errors Array of error messages
 * @returns JSON response with errors
 */
function handleErrors(res: Response, errors: string[]) {
  return res.status(400).json({ errors });
}

/**
 * Validates user registration data.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: string[] = [];
  const { username, email, password } = req.body;

  if (
    !username ||
    typeof username !== "string" ||
    username.trim().length < 3 ||
    username.trim().length > 30
  ) {
    errors.push("Username must be between 3 and 30 characters");
  }

  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push("Please provide a valid email");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) return handleErrors(res, errors);
  next();
}

/**
 * Validates user login data.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const errors: string[] = [];
  const { email, password } = req.body;

  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push("Please provide a valid email");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) return handleErrors(res, errors);
  next();
}
