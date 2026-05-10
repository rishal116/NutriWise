import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAuthCookies } from "../utils/jwt";
import { Request, Response } from "express";
import { UserModel, UserRole } from "../models/user.model";
import { StatusCode } from "../enums/statusCode.enum";

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
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "No refresh token found",
      });
    }

    const decoded = jwt.verify(
      token,
      jwtConfig.refreshToken.secret
    ) as {
      userId: string;
      activeRole: string;
      roles: string[];
    };

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
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
      generateTokens(
        String(user._id),
        activeRole,
        validRoles
      );

    setAuthCookies(res, newRefreshToken);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        roles: validRoles,
        activeRole,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};