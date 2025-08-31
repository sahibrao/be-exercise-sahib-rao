import { IUser } from "../models/user.model";
declare global {
  namespace Express {
    /**
     * Extends the Express Request interface to include the authenticated user.
     * @property {IUser} [user] - The authenticated user attached by auth middleware.
     */
    interface Request {
      user?: IUser;
    }
    interface Response {
      user?: IUser;
    }
  }
}
