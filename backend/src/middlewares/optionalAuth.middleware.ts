import { Request, Response, NextFunction } from "express";

import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { jwtConfig } from "../configs/jwt.config";

import { StatusCode } from "../enums/statusCode.enum";

import { AUTH_MESSAGES } from "../constants";

import { UserModel } from "../models/user.model";

import { UserRole } from "../enums/user.enum";

import { clearAuthCookies } from "../utils/token.util";

import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret,
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return next();
    }

    if (user.isBlocked) {
      clearAuthCookies(res);

      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: AUTH_MESSAGES.USER_BLOCKED,
        code: "USER_BLOCKED",
      });
    }

    if (decoded.activeRole !== user.activeRole) {
      logger.warn("User role changed. Clearing authentication.", {
        userId: user._id.toString(),
        tokenRole: decoded.activeRole,
        currentRole: user.activeRole,
      });

      clearAuthCookies(res);

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_ROLE,
        code: "INVALID_ROLE",
      });
    }

    req.user = {
      userId: user._id.toString(),
      activeRole: user.activeRole,
      roles: user.roles,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next();
    }

    if (error instanceof JsonWebTokenError) {
      return next();
    }

    logger.error("Optional authentication middleware failed", {
      error,
    });

    return next();
  }
};
