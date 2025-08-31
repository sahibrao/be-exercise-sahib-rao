import request from "supertest";
import app from "../../app";
// We import the IUser type here, outside of the jest.mock factory,
// to satisfy Jest's strict scoping rules for mocks.
import { IUser } from "../../models/user.model";
import mongoose from "mongoose";

const mockUser: Partial<IUser> = {
  _id: new mongoose.Types.ObjectId(),
  username: "john",
  email: "john@example.com",
  password: "hashedpassword",
  createdAt: new Date(),
  updatedAt: new Date(),
  comparePassword: async () => true,
};

// Mock AuthService and TodoService to isolate the controller layer.
jest.mock("../../services/auth.service", () => ({
  AuthService: {
    register: jest.fn().mockResolvedValue({
      user: { _id: "user123", username: "john", email: "john@example.com" },
      token: "mockToken123",
    }),
    login: jest.fn().mockResolvedValue({
      user: { _id: "user123", username: "john", email: "john@example.com" },
      token: "mockToken123",
    }),
  },
}));

jest.mock("../../services/todo.service", () => ({
  TodoService: {
    createTodo: jest.fn().mockResolvedValue({
      _id: "todo1",
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      status: "pending",
      priority: "medium",
      owner: "user123",
    }),
    getTodos: jest.fn().mockResolvedValue([
      {
        _id: "todo1",
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        status: "pending",
        priority: "medium",
        owner: "user123",
      },
    ]),
    getTodoById: jest.fn().mockResolvedValue({
      _id: "todo1",
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      status: "pending",
      priority: "medium",
      owner: "user123",
    }),
    updateTodo: jest.fn().mockResolvedValue({
      _id: "todo1",
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      status: "completed",
      priority: "high",
      owner: "user123",
    }),
    deleteTodo: jest.fn().mockResolvedValue(true),
  },
}));

// Mock middleware to always authenticate successfully.
jest.mock("../../middleware/auth.middleware", () => ({
  authenticate: (
    req: import("express").Request,
    res: import("express").Response,
    next: import("express").NextFunction
  ) => {
    // We now assign the pre-defined mockUser object to the request.
    req.user = mockUser as IUser;
    return next();
  },
}));

const MOCK_TOKEN = "mockToken123";

describe("Todo API Integration (Mocked)", () => {
  // This test no longer depends on a previous test.
  it("registers a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "jane", // Changed to a new user to illustrate independence
      email: "jane@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  // This test no longer depends on the previous test.
  it("logs in a user successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jane@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // Now, each subsequent test uses the MOCK_TOKEN directly,
  // making them completely independent.
  it("creates a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`)
      .send({
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        status: "pending",
        priority: "medium",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.todo.title).toBe("Buy groceries");
  });

  it("gets all todos", async () => {
    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos[0].title).toBe("Buy groceries");
  });

  it("gets a todo by id", async () => {
    const res = await request(app)
      .get("/api/todos/todo1")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.todo._id).toBe("todo1");
  });

  it("updates a todo", async () => {
    const res = await request(app)
      .put("/api/todos/todo1")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`)
      .send({ status: "completed", priority: "high" });
    expect(res.statusCode).toBe(200);
    expect(res.body.todo.status).toBe("completed");
    expect(res.body.todo.priority).toBe("high");
  });

  it("deletes a todo", async () => {
    const res = await request(app)
      .delete("/api/todos/todo1")
      .set("Authorization", `Bearer ${MOCK_TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
