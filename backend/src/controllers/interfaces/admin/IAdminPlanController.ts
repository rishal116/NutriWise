// controllers/interfaces/admin/IAdminPlanController.ts
import { Request, Response, NextFunction } from "express";

export interface IAdminPlanController {
  getAllPlans(req: Request, res: Response, next: NextFunction): void;
  publishPlan(req: Request, res: Response, next: NextFunction): void;
}
