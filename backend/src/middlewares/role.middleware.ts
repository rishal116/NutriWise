import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";
import { Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants/index"; 

export const authorize = (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(AUTH_MESSAGES.UNAUTHORIZED, StatusCode.UNAUTHORIZED)
      );
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError(AUTH_MESSAGES.FORBIDDEN, StatusCode.FORBIDDEN)
      );
    }
    next();
  };
