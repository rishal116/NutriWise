import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { ROLES, Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants";
import { UserModel } from "../models/user.model";

interface JwtPayload {
  userId: string;
  activeRole: Role;
  roles: Role[];
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.AUTH_HEADER_MISSING,
      code: "ACCESS_TOKEN_MISSING",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret,
    ) as JwtPayload;

    if (!ROLES.includes(decoded.activeRole)) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_ROLE,
      });
    }

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: "User is blocked",
      });
    }

    if (!user.roles.includes(decoded.activeRole)) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: AUTH_MESSAGES.FORBIDDEN,
      });
    }

    req.user = {
      userId: user._id.toString(),
      role: decoded.activeRole,
      roles: user.roles,
    };

    next();
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.name === "TokenExpiredError"
    ) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};