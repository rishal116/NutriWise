import { Request, Response, NextFunction } from "express";

export interface INutritionistController {
    getAllNutritionists(req: Request, res: Response, next: NextFunction): void;
    getNutritionistById(req: Request, res: Response, next: NextFunction): void;
}
