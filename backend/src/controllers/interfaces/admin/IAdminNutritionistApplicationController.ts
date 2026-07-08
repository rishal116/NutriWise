import { Request, Response, NextFunction } from "express";

export interface IAdminNutritionistApplicationController {
  getApplications(req: Request, res: Response, next: NextFunction): void;

  updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;
}
