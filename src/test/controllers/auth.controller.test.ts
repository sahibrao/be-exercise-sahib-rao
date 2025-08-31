import { Request, Response } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { AuthService } from "../../services/auth.service";

jest.mock("../../services/auth.service");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

/**
 * Test suite for AuthController.
 */
describe("AuthController", () => {
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  /**
   * Tests for register endpoint.
   */
  describe("register", () => {
    it("should register a user and return 201", async () => {
      const req = {
        body: { username: "test", email: "test@example.com", password: "pass" },
      } as Request;

      (AuthService.register as jest.Mock).mockResolvedValue({
        user: { _id: "123", username: "test", email: "test@example.com" },
        token: "mockToken",
      });

      await AuthController.register(req, res);

      expect(AuthService.register).toHaveBeenCalledWith(
        "test",
        "test@example.com",
        "pass"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: { id: "123", username: "test", email: "test@example.com" },
        token: "mockToken",
      });
    });

    it("should return 400 if error occurs", async () => {
      const req = { body: { username: "bad" } } as Request;
      (AuthService.register as jest.Mock).mockRejectedValue(new Error("fail"));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("login", () => {
    it("should login user and return token", async () => {
      const req = {
        body: { email: "test@example.com", password: "pass" },
      } as Request;

      (AuthService.login as jest.Mock).mockResolvedValue({
        user: { _id: "123", username: "test", email: "test@example.com" },
        token: "mockToken",
      });

      await AuthController.login(req, res);

      expect(AuthService.login).toHaveBeenCalledWith(
        "test@example.com",
        "pass"
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: { id: "123", username: "test", email: "test@example.com" },
        token: "mockToken",
      });
    });

    it("should return 401 if login fails", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrong" },
      } as Request;
      (AuthService.login as jest.Mock).mockRejectedValue(
        new Error("Invalid password")
      );

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const req = {
        user: { _id: "123", username: "test", email: "test@example.com" },
      } as any;

      await AuthController.getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: { id: "123", username: "test", email: "test@example.com" },
      });
    });
  });
});
