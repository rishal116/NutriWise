import { Request, Response, NextFunction } from "express";

export interface INutritionistAuthController {
  submitDetails: (req: Request, res: Response, next: NextFunction) => void;
  getRejectionReason: (req: Request, res: Response, next: NextFunction) => void;
  getName:(req:Request, res:Response, next:NextFunction) => void;
}