import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import { AuthService } from "../../services/auth.service";

jest.mock("jsonwebtoken");
jest.mock("../../models/user.model");

/**
 * Test suite for AuthService.
 */
describe("AuthService", () => {
  const mockUserId = "12345";
  const mockToken = "mockToken";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests for generateToken method.
   */
  describe("generateToken", () => {
    it("should generate a JWT token with userId", () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = AuthService.generateToken(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );
      expect(token).toBe(mockToken);
    });
  });

  /**
   * Tests for register method.
   */
  describe("register", () => {
    it("should throw an error if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: "existing" });

      await expect(
        AuthService.register("testuser", "test@example.com", "password")
      ).rejects.toThrow("User with this email or username already exists");
    });

    it("should create a new user and return user + token", async () => {
      const mockUser = {
        _id: mockUserId,
        username: "test",
        email: "test@example.com",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await AuthService.register(
        "test",
        "test@example.com",
        "password"
      );

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "test" }],
      });
      expect(User.create).toHaveBeenCalledWith({
        username: "test",
        email: "test@example.com",
        password: "password",
      });
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });
  });

  describe("login", () => {
    it("should throw error if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login("test@example.com", "password")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password invalid", async () => {
      const mockUser: any = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.login("test@example.com", "wrongpass")
      ).rejects.toThrow("Invalid password");
    });

    it("should return user and token if credentials are valid", async () => {
      const mockUser: any = {
        _id: mockUserId,
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await AuthService.login("test@example.com", "password");

      expect(mockUser.comparePassword).toHaveBeenCalledWith("password");
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });
  });
});
