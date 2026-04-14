
import { Request, Response, NextFunction } from "express";

export interface IHealthProgressController {
   getHealthProgress: (req: Request, res: Response, next: NextFunction) => void;
   getProgressByDate: (req: Request, res: Response, next: NextFunction) => void;
   getLatestProgress: (req: Request, res: Response, next: NextFunction) => void;
}
