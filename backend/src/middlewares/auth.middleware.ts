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

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  console.log("Auth middleware started");
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    logger.warn(AUTH_MESSAGES.ACCESS_TOKEN_MISSING);

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: AUTH_MESSAGES.ACCESS_TOKEN_MISSING,
      code: "ACCESS_TOKEN_MISSING",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.accessToken.secret,
    ) as JwtPayload;

    console.log(decoded);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.USER_NOT_FOUND,
        code: "USER_NOT_FOUND",
      });
    }

    if (user.isBlocked) {
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

    console.log("Auth middleware passed");
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_TOKEN,
        code: "INVALID_ACCESS_TOKEN",
      });
    }

    logger.error("Authentication middleware failed", { error });

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};
