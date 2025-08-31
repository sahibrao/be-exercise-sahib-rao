import Todo, { ITodo } from "../models/todo.model";
import { Types } from "mongoose";

/**
 * Interface for filtering todo queries.
 * @interface TodoFilters
 * @property {string} [status] - Filter by todo status.
 * @property {string} [priority] - Filter by todo priority.
 * @property {string} [search] - Search term for text search.
 */
interface TodoFilters {
  status?: string;
  priority?: string;
  search?: string;
}

/**
 * Service class for todo CRUD operations.
 */
export class TodoService {
  /**
   * Creates a new todo item for a user.
   * @param {Partial<ITodo>} todoData - Data for the new todo.
   * @param {string} userId - The user's unique identifier.
   * @returns {Promise<ITodo>} - The created todo item.
   */
  static async createTodo(
    todoData: Partial<ITodo>,
    userId: string
  ): Promise<ITodo> {
    const todo = await Todo.create({
      ...todoData,
      owner: userId,
    });

    return todo.populate("owner", "username email");
  }

  /**
   * Retrieves todos matching the provided filters.
   * @param {TodoFilters} filters - Filters for querying todos.
   * @returns {Promise<ITodo[]>} - Array of matching todo items.
   */
  static async getTodos(filters: TodoFilters): Promise<ITodo[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const todos = await Todo.find(query)
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    return todos;
  }

  /**
   * Retrieves a todo item by its ID.
   * @param {string} todoId - The todo item's unique identifier.
   * @returns {Promise<ITodo | null>} - The todo item or null if not found.
   * @throws {Error} - If the ID is invalid.
   */
  static async getTodoById(todoId: string): Promise<ITodo | null> {
    if (!Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid ID");
    }

    const todo = await Todo.findById(todoId).populate(
      "owner",
      "username email"
    );

    return todo;
  }

  /**
   * Updates a user's todo item.
   * @param {string} todoId - The todo item's unique identifier.
   * @param {string} userId - The user's unique identifier.
   * @param {Partial<ITodo>} updates - Fields to update.
   * @returns {Promise<ITodo | null>} - The updated todo item or null if not found.
   * @throws {Error} - If the todo ID is invalid.
   */
  static async updateTodo(
    todoId: string,
    userId: string,
    updates: Partial<ITodo>
  ): Promise<ITodo | null> {
    if (!Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid todo ID");
    }

    const todo = await Todo.findOne({
      _id: todoId,
      owner: userId,
    });

    if (!todo) {
      return null;
    }

    Object.assign(todo, updates);
    await todo.save();

    return todo.populate("owner", "username email");
  }

  /**
   * Deletes a user's todo item.
   * @param {string} todoId - The todo item's unique identifier.
   * @param {string} userId - The user's unique identifier.
   * @returns {Promise<boolean>} - True if deleted, false otherwise.
   * @throws {Error} - If the todo ID is invalid.
   */
  static async deleteTodo(todoId: string, userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(todoId)) {
      throw new Error("Invalid todo ID");
    }

    const result = await Todo.deleteOne({
      _id: todoId,
      owner: userId,
    });

    return result.deletedCount > 0;
  }
}
