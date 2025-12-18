import { Request, Response, NextFunction } from "express";

export interface IAdminAuthController {
  login(req: Request, res: Response, next: NextFunction): void;
  forgotPassword(req: Request, res: Response, next: NextFunction): void;
  logout(req: Request, res: Response, next: NextFunction): void;
}
