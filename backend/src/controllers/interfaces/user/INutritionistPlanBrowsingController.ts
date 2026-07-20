import { NextFunction, Request, Response } from "express";

export interface INutritionistPlanBrowsingController {
  getPlans(req: Request, res: Response, next: NextFunction): void;

  getPlanBySlug(req: Request, res: Response, next: NextFunction): void;
}
