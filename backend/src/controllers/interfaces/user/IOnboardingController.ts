import { Request, Response, NextFunction } from "express";

export interface IOnboardingController {
  completeProfile: (req: Request, res: Response, next: NextFunction) => void;
}
