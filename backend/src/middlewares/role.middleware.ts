import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";
import { Role } from "../types/role";
import { AUTH_MESSAGES } from "../constants/index"; 

export const authorize = (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`[RoleMiddleware] Checking access. User Role: ${req.user?.role}, Allowed Roles: ${allowedRoles}`);
    if (!req.user) {
      
      return next(
        new CustomError(AUTH_MESSAGES.UNAUTHORIZED, StatusCode.UNAUTHORIZED)
      );
    }
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`[RoleMiddleware] Access Denied. User Role: ${req.user.role}, Required: ${allowedRoles}`);
      return next(
        new CustomError(AUTH_MESSAGES.FORBIDDEN, StatusCode.FORBIDDEN)
      );
    }
    next();
  };
