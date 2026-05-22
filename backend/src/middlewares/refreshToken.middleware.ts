import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAuthCookies, setAdminAuthCookies } from "../utils/jwt";
import { Request, Response } from "express";
import { UserModel, UserRole } from "../models/user.model";
import { StatusCode } from "../enums/statusCode.enum";
import logger from "../utils/logger";

const toUserRoles = (roles: string[]): UserRole[] => {
  return roles.filter(
    (role): role is UserRole =>
      role === "client" ||
      role === "nutritionist" ||
      role === "admin"
  );
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    logger.info("Refresh token request received", {
      ip: req.ip,
    });

    const token = req.cookies.refreshToken;

    if (!token) {
      logger.warn("Missing refresh token", { ip: req.ip });

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "No refresh token found",
      });
    }

    const decoded = jwt.verify(token, jwtConfig.refreshToken.secret) as {
      userId: string;
      activeRole: string;
      roles: string[];
    };

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      logger.error("User not found during refresh", {
        userId: decoded.userId,
      });

      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const validRoles = toUserRoles(user.roles);

    const activeRole: UserRole =
      validRoles.includes(user.activeRole as UserRole)
        ? (user.activeRole as UserRole)
        : "client";

    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(String(user._id), activeRole, validRoles);

    if (activeRole === "admin") {
      setAdminAuthCookies(res, newRefreshToken);
    } else {
      setAuthCookies(res, newRefreshToken);
    }

    logger.info("Token refreshed successfully", {
      userId: user._id.toString(),
      activeRole,
    });

    return res.status(StatusCode.OK).json({
      success: true,
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        roles: validRoles,
        activeRole,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      logger.warn("Refresh token expired");

      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    logger.error("Invalid refresh token", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};