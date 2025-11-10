import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Authorization header missing", StatusCode.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.accessToken.secret) as {
      userId: string;
      role: string;
    };

    // attach user data to request object
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new CustomError("Token expired", StatusCode.UNAUTHORIZED));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new CustomError("Invalid token", StatusCode.UNAUTHORIZED));
    }
    next(new CustomError("Authentication failed", StatusCode.UNAUTHORIZED));
  }
};
