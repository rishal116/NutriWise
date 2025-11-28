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
    const validRoles = ["client", "nutritionist", "admin"] as const;
    if (!validRoles.includes(decoded.role as any)) {
      throw new CustomError("Invalid role in token", StatusCode.UNAUTHORIZED);
    }
    req.user = {
      userId: decoded.userId,
      role: decoded.role as "client" | "nutritionist" | "admin",
    };
    next();
  } catch (error: any) {
    console.log(error);
    
    if (error.name === "TokenExpiredError") {
      console.log("Mistake ",error.name);
      
      
      return next(new CustomError("Token expired", StatusCode.UNAUTHORIZED));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new CustomError("Invalid token", StatusCode.UNAUTHORIZED));
    }
    next(new CustomError("Authentication failed", StatusCode.UNAUTHORIZED));
  }
};



