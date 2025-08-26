import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type IUser, User } from "./model.js";


//extend the express request type to include a user property
export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }

    //Verifies the JWT using a secret from environment variables. If valid, decodes the token and casts it as a JWT payload.
    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as jwt.JwtPayload;

    //If the token is invalid or missing the _id property, responds with HTTP 403 and "Invalid Token".
    if (!decodedValue || !decodedValue._id) {
      res.status(403).json({
        message: "Invalid Token",
      });
      return;
    }

    //Extracts the user ID from the token, then queries the database for the user (excluding the password field).
    const userId = decodedValue._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: "User Not found",
      });
      return;
    }
    //Attaches the user object to the request and calls next() to pass control to the next middleware or route handler.
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
  }
};
