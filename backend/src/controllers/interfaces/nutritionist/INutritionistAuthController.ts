import { Request, Response, NextFunction } from "express";

export interface INutritionistAuthController {
  register: (req: Request, res: Response, next: NextFunction) => void;
  verifyOtp: (req: Request, res: Response, next: NextFunction) => void;
  resendOtp: (req: Request, res: Response, next: NextFunction) => void;
  submitDetails: (req: Request, res: Response, next: NextFunction) => void; //
}