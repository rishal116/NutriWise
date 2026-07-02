import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { AUTH_MESSAGES } from "../constants";
import { UserModel } from "../models/user.model";
import { UserRole } from "../enums/userRole.enum";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn("Authorization header missing");

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



    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      logger.warn("Access token used for non-existent user", {
        userId: decoded.userId,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      logger.warn("Blocked user attempted to access protected route", {
        userId: user._id.toString(),
      });

      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: "User is blocked",
      });
    }

    if (decoded.activeRole !== user.activeRole) {
      logger.warn("Role mismatch detected", {
        userId: user._id.toString(),
        tokenRole: decoded.activeRole,
        activeRole: user.activeRole,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_ROLE,
      });
    }

    req.user = {
      userId: user._id.toString(),
      activeRole: user.activeRole,
      roles: user.roles,
    };

    return next();
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      logger.warn("Access token expired");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    if (error instanceof JsonWebTokenError) {
      logger.warn("Invalid access token");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_TOKEN,
      });
    }

    logger.error("Authentication middleware failed", {
      error,
    });

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};