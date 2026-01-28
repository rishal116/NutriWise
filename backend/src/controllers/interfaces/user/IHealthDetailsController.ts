
import { Request, Response, NextFunction } from "express";

export interface IHealthDetailsController {
   getMyDetails: (req: Request, res: Response, next: NextFunction) => void;
   saveDetails: (req: Request, res: Response, next: NextFunction) => void;
}
