
import { Request, Response, NextFunction } from "express";

export interface IUserAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => void;
  verifyOtp: (req: Request, res: Response, next: NextFunction) => void;
  resendOtp: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  googleLogin: (req: Request, res: Response, next: NextFunction) => void;
  forgotPassword: (req: Request, res: Response, next: NextFunction) => void;
  resetPassword: (req: Request, res: Response, next: NextFunction) => void;
}
