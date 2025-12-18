import { Request, Response, NextFunction } from "express";

export interface IUserProfileController {
  getProfile(req: Request, res: Response, next: NextFunction): void;
  updateProfile(req: Request, res: Response, next: NextFunction): void;
}
