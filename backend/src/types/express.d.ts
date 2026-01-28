// src/types/express.d.ts
import "express";
import { Role } from "./role";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}
