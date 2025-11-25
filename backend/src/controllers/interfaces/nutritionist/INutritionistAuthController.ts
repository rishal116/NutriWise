import { Request, Response, NextFunction } from "express";

export interface INutritionistAuthController {
  submitDetails: (req: Request, res: Response, next: NextFunction) => void;
}