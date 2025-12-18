import { Request, Response, NextFunction } from "express";

export interface INutritionistProfileController {
  getNutritionistProfile: (req: Request, res: Response, next: NextFunction) => void;
  updateNutritionistProfile: (req: Request, res: Response, next: NextFunction) => void;
}
