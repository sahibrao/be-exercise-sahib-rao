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
 * Validates the creation of a Todo item.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function validateCreateTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: string[] = [];
  const { title, description, status, priority, dueDate } = req.body;

  if (
    !title ||
    typeof title !== "string" ||
    title.trim().length === 0 ||
    title.length > 100
  ) {
    errors.push("Title is required and cannot be longer than 100 characters");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0 ||
    description.length > 500
  ) {
    errors.push(
      "Description is required and cannot be longer than 500 characters"
    );
  }

  const validStatuses = ["pending", "in-progress", "completed"];
  if (status && !validStatuses.includes(status)) {
    errors.push("Invalid status");
  }

  const validPriorities = ["low", "medium", "high"];
  if (priority && !validPriorities.includes(priority)) {
    errors.push("Invalid priority");
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    errors.push("Invalid date format");
  }

  if (errors.length > 0) return handleErrors(res, errors);
  next();
}

/**
 * Validates the update of a Todo item.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function validateUpdateTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: string[] = [];
  const { title, description, status, priority, dueDate } = req.body;

  if (title && (typeof title !== "string" || title.length > 100)) {
    errors.push("Title cannot be longer than 100 characters");
  }

  if (
    description &&
    (typeof description !== "string" || description.length > 500)
  ) {
    errors.push("Description cannot be longer than 500 characters");
  }

  const validStatuses = ["pending", "in-progress", "completed"];
  if (status && !validStatuses.includes(status)) {
    errors.push("Invalid status");
  }

  const validPriorities = ["low", "medium", "high"];
  if (priority && !validPriorities.includes(priority)) {
    errors.push("Invalid priority");
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    errors.push("Invalid date format");
  }

  if (errors.length > 0) return handleErrors(res, errors);
  next();
}

/**
 * Validates query parameters for fetching Todos.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function validateTodoQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: string[] = [];
  const { status, priority, search } = req.query;

  const validStatuses = ["pending", "in-progress", "completed"];
  if (status && !validStatuses.includes(status as string)) {
    errors.push("Invalid status");
  }

  const validPriorities = ["low", "medium", "high"];
  if (priority && !validPriorities.includes(priority as string)) {
    errors.push("Invalid priority");
  }

  if (search && typeof search === "string" && search.trim().length === 0) {
    errors.push("Search query cannot be empty");
  }

  if (errors.length > 0) return handleErrors(res, errors);
  next();
}
