
import { Request, Response, NextFunction } from "express";

export interface IUserPlanController {
    getMyPlans: (req: Request, res: Response, next: NextFunction) => void;
}
