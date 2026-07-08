import { Request, Response, NextFunction } from "express";

export interface INutritionistApplicationController {
  getApplicationDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  submitApplication: (req: Request, res: Response, next: NextFunction) => void;
  getApplicationStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
