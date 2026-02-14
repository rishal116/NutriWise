
import { Request, Response, NextFunction } from "express";

export interface INutritionistSubscriptionController {
    getSubscribers: (req: Request, res: Response, next: NextFunction) => void;
}
