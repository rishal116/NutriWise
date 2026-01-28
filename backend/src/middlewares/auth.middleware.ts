import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";
import { ROLES, Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants/index";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
  try {
    console.log("1");
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new CustomError(AUTH_MESSAGES.AUTH_HEADER_MISSING,StatusCode.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload;
    if (!ROLES.includes(decoded.role)) {
      throw new CustomError(AUTH_MESSAGES.INVALID_ROLE,StatusCode.UNAUTHORIZED);
    }
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error: any) {
    console.log("",error);
    
    if (error.name === "TokenExpiredError") {      
      return next(new CustomError(AUTH_MESSAGES.TOKEN_EXPIRED, StatusCode.UNAUTHORIZED));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new CustomError(AUTH_MESSAGES.INVALID_TOKEN, StatusCode.UNAUTHORIZED));
    }
    next(new CustomError(AUTH_MESSAGES.AUTH_FAILED, StatusCode.UNAUTHORIZED));
  }
};
