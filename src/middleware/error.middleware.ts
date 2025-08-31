import { Request, Response, NextFunction } from "express";

/**
 * Express error-handling middleware.
 * Logs the error stack and sends a JSON response with error details.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {void}
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  res.status(500).json({
    error: "There is an error.",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
