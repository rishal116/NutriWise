import { NextFunction, Request, Response } from "express";

export interface INutritionistBrowsingController {
  browseNutritionists(req: Request, res: Response, next: NextFunction): void;

  getNutritionistProfile(req: Request, res: Response, next: NextFunction): void;

  getBrowseStatistics(req: Request, res: Response, next: NextFunction): void;
}
