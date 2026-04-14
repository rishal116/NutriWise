
import { Request, Response, NextFunction } from "express";

export interface INutritionistSubscriptionController {
    getSubscriptions: (req: Request, res: Response, next: NextFunction) => void;
    getSubscribers: (req: Request, res: Response, next: NextFunction) => void;
}
