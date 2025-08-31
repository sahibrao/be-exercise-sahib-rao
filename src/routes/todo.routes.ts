import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoQuery,
} from "../utils/todoValidators";

/**
 * Express router for todo-related routes.
 * @module todo.routes
 * @description Handles CRUD operations for todo items.
 */
const router = Router();

/**
 * Applies authentication middleware to all todo routes.
 * @middleware authenticate - Ensures the user is authenticated.
 */
router.use(authenticate);

/**
 * @route POST /
 * @description Creates a new todo item.
 * @middleware validateCreateTodo - Validates todo creation input.
 * @controller TodoController.createTodo
 */
router.post("/", validateCreateTodo, TodoController.createTodo);

/**
 * @route GET /
 * @description Retrieves a list of todo items with optional filters.
 * @middleware validateTodoQuery - Validates query parameters.
 * @controller TodoController.getTodos
 */
router.get("/", validateTodoQuery, TodoController.getTodos);

/**
 * @route GET /:id
 * @description Retrieves a single todo item by ID.
 * @controller TodoController.getTodoById
 */
router.get("/:id", TodoController.getTodoById);

/**
 * @route PUT /:id
 * @description Updates an existing todo item by ID.
 * @middleware validateUpdateTodo - Validates update input.
 * @controller TodoController.updateTodo
 */
router.put("/:id", validateUpdateTodo, TodoController.updateTodo);

/**
 * @route DELETE /:id
 * @description Deletes a todo item by ID.
 * @controller TodoController.deleteTodo
 */
router.delete("/:id", TodoController.deleteTodo);

export default router;
