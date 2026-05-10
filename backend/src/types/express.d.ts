// types/express/index.d.ts
import { Role } from "../src/types/role";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        roles?: Role[];
      };
    }
  }
}

export {};