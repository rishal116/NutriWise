import "express-session";
import { UserRole } from "../enums/userRole.enum"; 

declare module "express-session" {
  interface SessionData {
    tempUser?: {
      fullName: string;
      email: string;
      password: string;
      role: UserRole; 
    };
  }
}