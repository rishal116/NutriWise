import { Request, Response, NextFunction } from "express";

export interface IAdminNutritionistController {
  getNutritionists(req: Request, res: Response, next: NextFunction): void;

  getNutritionistDetails(req: Request, res: Response, next: NextFunction): void;

  updateCoachLevel(req: Request, res: Response, next: NextFunction): void;
}
