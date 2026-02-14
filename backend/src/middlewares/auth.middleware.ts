import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { ROLES, Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants/index";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Access token missing → soft 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: AUTH_MESSAGES.AUTH_HEADER_MISSING,
      code: "ACCESS_TOKEN_MISSING",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret
    ) as JwtPayload;

    if (!ROLES.includes(decoded.role)) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.INVALID_ROLE,
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    return res.status(StatusCode.UNAUTHORIZED).json({
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};
