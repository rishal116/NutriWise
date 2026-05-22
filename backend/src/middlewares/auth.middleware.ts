import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { ROLES, Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants";
import { UserModel } from "../models/user.model";
import logger from "../utils/logger";

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

  // 🔍 1. No auth header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[AuthMiddleware] Missing Authorization header", {
      path: req.path,
      method: req.method,
    });

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.AUTH_HEADER_MISSING,
      code: "ACCESS_TOKEN_MISSING",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔍 2. Token decode
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret,
    ) as JwtPayload;

    logger.info("[AuthMiddleware] Token decoded", {
      userId: decoded.userId,
      role: decoded.activeRole,
      path: req.path,
    });

    // 🔍 3. Role validation
    if (!ROLES.includes(decoded.activeRole)) {
      logger.warn("[AuthMiddleware] Invalid role in token", {
        role: decoded.activeRole,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_ROLE,
      });
    }

    // 🔍 4. DB user check
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      logger.warn("[AuthMiddleware] User not found", {
        userId: decoded.userId,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔍 5. Blocked user
    if (user.isBlocked) {
      logger.warn("[AuthMiddleware] Blocked user attempted access", {
        userId: user._id.toString(),
        email: user.email,
      });

      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: "User is blocked",
      });
    }

    // 🔍 6. Role mismatch
    if (!user.roles.includes(decoded.activeRole)) {
      logger.warn("[AuthMiddleware] Role mismatch", {
        tokenRole: decoded.activeRole,
        userRoles: user.roles,
      });

      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: AUTH_MESSAGES.FORBIDDEN,
      });
    }

    // ✅ SUCCESS
    req.user = {
      userId: user._id.toString(),
      role: decoded.activeRole,
      roles: user.roles,
    };

    logger.info("[AuthMiddleware] Authentication successful", {
      userId: user._id.toString(),
      email: user.email,
      role: decoded.activeRole,
    });

    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      logger.warn("[AuthMiddleware] Token expired", {
        path: req.path,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    logger.error("[AuthMiddleware] Invalid token error", {
      error: error instanceof Error ? error.message : error,
    });

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};