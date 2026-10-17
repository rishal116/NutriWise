import type { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.config";
import { UserModel } from "../models/user.model";
import { UserRole } from "../enums/user.enum";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next();
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

    if (!user || user.isBlocked) {
      next();
      return;
    }

    if (decoded.activeRole !== user.activeRole) {
      logger.warn("Optional authentication role mismatch.", {
        userId: user._id.toString(),
        tokenRole: decoded.activeRole,
        currentRole: user.activeRole,
      });

      next();
      return;
    }

    req.user = {
      userId: user._id.toString(),
      activeRole: user.activeRole,
      roles: user.roles,
    };

    next();
  } catch (error: unknown) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      next();
      return;
    }

    logger.error("Optional authentication middleware failed", {
      error,
    });

    next();
  }
};
