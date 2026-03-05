import { NextFunction, Request, Response } from "express";

export interface INutritionistPlanController {
  createPlan(req: Request, res: Response, next: NextFunction ): void;
  updatePlan(req: Request, res: Response, next: NextFunction): void;
  getMyPlans(req: Request, res: Response, next: NextFunction): void;
  getAllowedPlanCategories(req: Request, res: Response, next: NextFunction): void;
  getNutritionistPricing(req: Request, res: Response, next: NextFunction): void;
  getPlanById(req: Request, res: Response, next: NextFunction): void;
}