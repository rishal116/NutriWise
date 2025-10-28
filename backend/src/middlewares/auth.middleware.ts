import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Authorization header missing", StatusCode.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.accessToken.secret) as { userId: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    throw new CustomError("Invalid or expired token", StatusCode.UNAUTHORIZED);
  }
};
