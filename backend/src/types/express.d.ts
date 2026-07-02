import "express";
import { UserRole } from "../enums/userRole.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        activeRole: UserRole;
        roles: UserRole[];
      };
    }
  }
}

export {};
