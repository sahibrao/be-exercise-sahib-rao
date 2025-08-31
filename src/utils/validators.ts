import { Request, Response, NextFunction } from "express";

// A helper to send validation errors
function handleErrors(res: Response, errors: string[]) {
  return res.status(400).json({ errors });
}

// Validators for Users
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

// Validators for Todos
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
