import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { StatusCode } from "../enums/statusCode.enum";
import { ROLES, Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants/index";
import { UserModel } from "../models/user.model";
import { AdminModel } from "../models/admin.model";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCode.UNAUTHORIZED).json({
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

    if (!ROLES.includes(decoded.role)) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.INVALID_ROLE,
      });
    }

    let user;

    if (decoded.role === "admin") {
      user = await AdminModel.findById(decoded.userId);
    } else {
      user = await UserModel.findById(decoded.userId);
    }

    if (!user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(StatusCode.FORBIDDEN).json({
        message: "User is blocked",
      });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    return res.status(StatusCode.UNAUTHORIZED).json({
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};
