import type { Request, Response, NextFunction } from "express";

export interface IUserContextController {
  getMe: (req: Request, res: Response, next: NextFunction) => void;
}