import type { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { jwtConfig } from "../configs/jwt.config";
import { StatusCode } from "../enums/statusCode.enum";
import { AUTH_MESSAGES } from "../constants";
import { UserModel } from "../models/user.model";
import { UserRole } from "../enums/user.enum";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    logger.warn(AUTH_MESSAGES.ACCESS_TOKEN_MISSING);

    res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.ACCESS_TOKEN_MISSING,
      code: "ACCESS_TOKEN_MISSING",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret,
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.userId)
      .select("_id activeRole roles isBlocked")
      .lean();

    if (!user) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.USER_NOT_FOUND,
        code: "USER_NOT_FOUND",
      });
      return;
    }

    if (user.isBlocked) {
      res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: AUTH_MESSAGES.USER_BLOCKED,
        code: "USER_BLOCKED",
      });
      return;
    }

    if (decoded.activeRole !== user.activeRole) {
      logger.warn("User role changed.", {
        userId: user._id.toString(),
        tokenRole: decoded.activeRole,
        currentRole: user.activeRole,
      });

      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_ROLE,
        code: "INVALID_ROLE",
      });
      return;
    }

    req.user = {
      userId: user._id.toString(),
      activeRole: user.activeRole,
      roles: user.roles,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_TOKEN,
        code: "INVALID_ACCESS_TOKEN",
      });
      return;
    }

    logger.error("Authentication middleware failed", { error });

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};
