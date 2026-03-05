import { Request, Response, NextFunction } from "express";

export interface IUserProfileController {
  getMyProfile(req: Request, res: Response, next: NextFunction): void;
  updateMyProfile(req: Request, res: Response, next: NextFunction): void;
  getMyProfileImage: (req: Request, res: Response, next: NextFunction) => void;
  updateMyProfileImage: (req: Request, res: Response, next: NextFunction) => void;
}
