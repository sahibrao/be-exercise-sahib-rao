import { Types } from "mongoose";
import Todo from "../../models/todo.model";
import { TodoService } from "../../services/todo.service";

jest.mock("../../models/todo.model");

/**
 * Test suite for TodoService.
 */
describe("TodoService", () => {
  const mockUserId = "12345";
  const mockTodoId = new Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for createTodo method.
   */
  describe("createTodo", () => {
    it("should create a todo and populate owner", async () => {
      const mockTodo: any = {
        populate: jest.fn().mockResolvedValue("populatedTodo"),
      };
      (Todo.create as jest.Mock).mockResolvedValue(mockTodo);

      const result = await TodoService.createTodo(
        { title: "Test" },
        mockUserId
      );

      expect(Todo.create).toHaveBeenCalledWith({
        title: "Test",
        owner: mockUserId,
      });
      expect(mockTodo.populate).toHaveBeenCalledWith("owner", "username email");
      expect(result).toBe("populatedTodo");
    });
  });

  /**
   * Tests for getTodos method.
   */
  describe("getTodos", () => {
    it("should build query based on filters and return todos", async () => {
      const mockTodos = ["todo1", "todo2"];
      (Todo.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTodos),
      });

      const result = await TodoService.getTodos({
        status: "open",
        search: "test",
      });

      expect(Todo.find).toHaveBeenCalledWith({
        status: "open",
        $text: { $search: "test" },
      });
      expect(result).toBe(mockTodos);
    });
  });

  describe("getTodoById", () => {
    it("should throw error if invalid id", async () => {
      await expect(TodoService.getTodoById("badId")).rejects.toThrow(
        "Invalid ID"
      );
    });

    it("should return todo if found", async () => {
      const mockTodo = { id: mockTodoId };
      (Todo.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTodo),
      });

      const result = await TodoService.getTodoById(mockTodoId);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);
      expect(result).toEqual(mockTodo);
    });
  });

  describe("updateTodo", () => {
    it("should throw error if invalid id", async () => {
      await expect(
        TodoService.updateTodo("badId", mockUserId, {})
      ).rejects.toThrow("Invalid todo ID");
    });

    it("should return null if todo not found", async () => {
      (Todo.findOne as jest.Mock).mockResolvedValue(null);

      const result = await TodoService.updateTodo(mockTodoId, mockUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
    });

    it("should update todo and return populated version", async () => {
      const updatedTodo = { title: "Updated", owner: mockUserId };
      const mockTodo: any = {
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(updatedTodo),
      };
      (Todo.findOne as jest.Mock).mockResolvedValue(mockTodo);

      const result = await TodoService.updateTodo(mockTodoId, mockUserId, {
        title: "Updated",
      });

      expect(result).not.toBeNull();
      if (result) {
        expect(result.title).toBe("Updated");
        expect(result.owner).toBe(mockUserId);
        expect(result).toEqual(updatedTodo);
      }
    });
  });

  describe("deleteTodo", () => {
    it("should throw error if invalid id", async () => {
      await expect(TodoService.deleteTodo("badId", mockUserId)).rejects.toThrow(
        "Invalid todo ID"
      );
    });

    it("should return true if deletedCount > 0", async () => {
      (Todo.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await TodoService.deleteTodo(mockTodoId, mockUserId);

      expect(result).toBe(true);
    });

    it("should return false if nothing deleted", async () => {
      (Todo.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

      const result = await TodoService.deleteTodo(mockTodoId, mockUserId);

      expect(result).toBe(false);
    });
  });
});
