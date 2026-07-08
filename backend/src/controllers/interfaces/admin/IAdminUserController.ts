import { Request, Response, NextFunction } from "express";

export interface IAdminUserController {
  getUsers(req: Request, res: Response, next: NextFunction): void;
  updateBlockStatus(req: Request, res: Response, next: NextFunction): void;
}
