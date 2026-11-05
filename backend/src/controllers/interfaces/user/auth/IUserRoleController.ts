import type { Request, Response, NextFunction } from "express";

export interface IUserRoleController {
  switchRole: (req: Request, res: Response, next: NextFunction) => void;
}