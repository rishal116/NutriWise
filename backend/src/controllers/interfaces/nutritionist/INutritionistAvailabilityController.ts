import { Request, Response, NextFunction } from "express";

export interface INutritionistAvailabilityController {
  saveAvailability: (req: Request, res: Response, next: NextFunction) => void;
  getAvailability: (req: Request, res: Response, next: NextFunction) => void;
}
