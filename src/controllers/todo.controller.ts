import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";

/**
 * Controller for handling Todo requests.
 */
export class TodoController {
  /**
   * Creates a new Todo item for the authenticated user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const todo = await TodoService.createTodo(
        req.body,
        req.user!._id.toString()
      );

      res.status(201).json({
        message: "Todo created successfully",
        todo,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Retrieves a list of Todo items, optionally filtered by status, priority, or search query.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async getTodos(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        search: req.query.search as string,
      };

      const todos = await TodoService.getTodos(filters);

      res.json({
        count: todos.length,
        todos,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves a single Todo item by its ID.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const todo = await TodoService.getTodoById(req.params.id);

      if (!todo) {
        res.status(404).json({ error: "Todo not found" });
        return;
      }

      res.json({ todo });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Updates an existing Todo item for the authenticated user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const todo = await TodoService.updateTodo(
        req.params.id,
        req.user!._id.toString(),
        req.body
      );

      if (!todo) {
        res.status(404).json({
          error: "Todo not found or you do not have permission to update it",
        });
        return;
      }

      res.json({
        message: "Todo updated successfully",
        todo,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Deletes a Todo item for the authenticated user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  static async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await TodoService.deleteTodo(
        req.params.id,
        req.user!._id.toString()
      );

      if (!deleted) {
        res.status(404).json({
          error: "Todo not found or you do not have permission to delete it",
        });
        return;
      }

      res.json({ message: "Todo deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
