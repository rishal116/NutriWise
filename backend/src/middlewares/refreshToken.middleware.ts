import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAuthCookies } from "../utils/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { UserRole } from "../enums/userRole.enum";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      logger.warn("Refresh token not found");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "No refresh token found",
      });
    }

    const decoded = jwt.verify(
      token,
      jwtConfig.refreshToken.secret,
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      logger.warn("Refresh token used for non-existent user", {
        userId: decoded.userId,
      });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
    }

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.activeRole,
    );

    setAuthCookies(res, refreshToken);

    logger.info("Access token refreshed", {
      userId: user._id.toString(),
      activeRole: user.activeRole,
    });

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
      activeRole: user.activeRole,
    });
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      logger.warn("Refresh token expired");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    if (error instanceof JsonWebTokenError) {
      logger.warn("Invalid refresh token");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    logger.error("Failed to refresh access token", {
      error,
    });

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};
