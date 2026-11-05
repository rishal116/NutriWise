import type { Request, Response, NextFunction } from "express";

export interface IUserPasswordController {
  forgotPassword: (req: Request, res: Response, next: NextFunction) => void;
  resetPassword: (req: Request, res: Response, next: NextFunction) => void;
}