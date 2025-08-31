import { Request, Response } from "express";
import { TodoController } from "../../controllers/todo.controller";
import { TodoService } from "../../services/todo.service";

jest.mock("../../services/todo.service");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

/**
 * Test suite for TodoController.
 */
describe("TodoController", () => {
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  /**
   * Tests for createTodo endpoint.
   */
  describe("createTodo", () => {
    it("should create todo and return 201", async () => {
      const req = { body: { title: "test" }, user: { _id: "123" } } as any;
      (TodoService.createTodo as jest.Mock).mockResolvedValue("todoItem");

      await TodoController.createTodo(req, res);

      expect(TodoService.createTodo).toHaveBeenCalledWith(
        { title: "test" },
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Todo created successfully",
        todo: "todoItem",
      });
    });

    it("should return 400 on error", async () => {
      const req = { body: {}, user: { _id: "123" } } as any;
      (TodoService.createTodo as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await TodoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getTodos", () => {
    it("should return todos", async () => {
      const req = { query: { status: "open" } } as any;
      (TodoService.getTodos as jest.Mock).mockResolvedValue(["todo1", "todo2"]);

      await TodoController.getTodos(req, res);

      expect(TodoService.getTodos).toHaveBeenCalledWith({
        status: "open",
        priority: undefined,
        search: undefined,
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        todos: ["todo1", "todo2"],
      });
    });

    it("should return 500 on error", async () => {
      const req = { query: {} } as any;
      (TodoService.getTodos as jest.Mock).mockRejectedValue(new Error("fail"));

      await TodoController.getTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getTodoById", () => {
    it("should return todo if found", async () => {
      const req = { params: { id: "1" } } as any;
      (TodoService.getTodoById as jest.Mock).mockResolvedValue("todoItem");

      await TodoController.getTodoById(req, res);

      expect(res.json).toHaveBeenCalledWith({ todo: "todoItem" });
    });

    it("should return 404 if not found", async () => {
      const req = { params: { id: "1" } } as any;
      (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);

      await TodoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
    });

    it("should return 400 on error", async () => {
      const req = { params: { id: "1" } } as any;
      (TodoService.getTodoById as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await TodoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("updateTodo", () => {
    it("should update todo if found", async () => {
      const req = {
        params: { id: "1" },
        body: { title: "updated" },
        user: { _id: "123" },
      } as any;
      (TodoService.updateTodo as jest.Mock).mockResolvedValue("updatedTodo");

      await TodoController.updateTodo(req, res);

      expect(TodoService.updateTodo).toHaveBeenCalledWith("1", "123", {
        title: "updated",
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Todo updated successfully",
        todo: "updatedTodo",
      });
    });

    it("should return 404 if not found", async () => {
      const req = {
        params: { id: "1" },
        body: {},
        user: { _id: "123" },
      } as any;
      (TodoService.updateTodo as jest.Mock).mockResolvedValue(null);

      await TodoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todo not found or you do not have permission to update it",
      });
    });

    it("should return 400 on error", async () => {
      const req = {
        params: { id: "1" },
        body: {},
        user: { _id: "123" },
      } as any;
      (TodoService.updateTodo as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await TodoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo if found", async () => {
      const req = { params: { id: "1" }, user: { _id: "123" } } as any;
      (TodoService.deleteTodo as jest.Mock).mockResolvedValue(true);

      await TodoController.deleteTodo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Todo deleted successfully",
      });
    });

    it("should return 404 if not found", async () => {
      const req = { params: { id: "1" }, user: { _id: "123" } } as any;
      (TodoService.deleteTodo as jest.Mock).mockResolvedValue(false);

      await TodoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todo not found or you do not have permission to delete it",
      });
    });

    it("should return 400 on error", async () => {
      const req = { params: { id: "1" }, user: { _id: "123" } } as any;
      (TodoService.deleteTodo as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await TodoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });
});
