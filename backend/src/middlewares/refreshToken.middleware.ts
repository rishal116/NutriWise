import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import type { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { jwtConfig } from "../configs/jwt.config";
import {
  clearAuthCookies,
  generateTokens,
  setAuthCookies,
} from "../utils/token.util";
import { StatusCode } from "../enums/statusCode.enum";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: string;
}

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;

    if (!refreshTokenValue) {
      logger.warn("Refresh token not found");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "No refresh token found",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(
      refreshTokenValue,
      jwtConfig.refreshToken.secret,
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.userId)
      .select("_id activeRole roles isBlocked deletedAt")
      .lean();

    if (!user) {
      logger.warn("Refresh token used for non-existent user", {
        userId: decoded.userId,
      });

      clearAuthCookies(res);

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.deletedAt) {
      logger.warn("Refresh token used for deleted user", {
        userId: user._id.toString(),
      });

      clearAuthCookies(res);

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Account has been deleted",
        code: "ACCOUNT_DELETED",
      });
    }

    if (user.isBlocked) {
      logger.warn("Refresh token used for blocked user", {
        userId: user._id.toString(),
      });

      clearAuthCookies(res);

      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: "Account has been blocked",
        code: "USER_BLOCKED",
      });
    }

    const tokens = generateTokens(user._id.toString(), user.activeRole);

    setAuthCookies(res, tokens.refreshToken);

    logger.info("Tokens refreshed", {
      userId: user._id.toString(),
      activeRole: user.activeRole,
    });

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Tokens refreshed successfully",
      accessToken: tokens.accessToken,
    });
  } catch (error: unknown) {
    clearAuthCookies(res);

    if (error instanceof TokenExpiredError) {
      logger.warn("Refresh token expired");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token expired",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    if (error instanceof JsonWebTokenError) {
      logger.warn("Invalid refresh token");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    logger.error("Failed to refresh tokens", { error });

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};
