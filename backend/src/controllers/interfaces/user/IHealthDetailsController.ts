
import { Request, Response, NextFunction } from "express";

export interface IHealthDetailsController {
   getHealthDetails: (req: Request, res: Response, next: NextFunction) => void;
   saveHealthDetails: (req: Request, res: Response, next: NextFunction) => void;
}
