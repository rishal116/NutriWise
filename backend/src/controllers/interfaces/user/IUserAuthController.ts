
import { Request, Response, NextFunction } from "express";

export interface IUserAuthController {
  register: (req: Request, res: Response, next: NextFunction) => void;
  verifyOtp: (req: Request, res: Response, next: NextFunction) => void;
  resendOtp: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  googleLogin: (req: Request, res: Response, next: NextFunction) => void;
}
