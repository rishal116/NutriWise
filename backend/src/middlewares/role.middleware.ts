import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";
import { UserRole } from "../enums/userRole.enum";
import { AUTH_MESSAGES } from "../constants";

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(
          AUTH_MESSAGES.UNAUTHORIZED,
          StatusCode.UNAUTHORIZED,
        ),
      );
    }

    if (!allowedRoles.includes(req.user.activeRole)) {
      return next(
        new CustomError(
          AUTH_MESSAGES.FORBIDDEN,
          StatusCode.FORBIDDEN,
        ),
      );
    }

    return next();
  };