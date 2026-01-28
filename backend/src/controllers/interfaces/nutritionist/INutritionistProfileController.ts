import { Request, Response, NextFunction } from "express";

export interface INutritionistProfileController {
  getNutritionistProfile: (req: Request, res: Response, next: NextFunction) => void;
  updateNutritionistProfile: (req: Request, res: Response, next: NextFunction) => void;
  getNutritionistProfileImage: (req: Request, res: Response, next: NextFunction) => void;
  updateNutritionistProfileImage: (req: Request, res: Response, next: NextFunction) => void;
}
