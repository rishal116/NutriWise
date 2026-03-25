
import { Request, Response, NextFunction } from "express";

export interface IReviewController {
   submitReview: (req: Request, res: Response, next: NextFunction) => void;
   getMyReview: (req: Request, res: Response, next: NextFunction) => void;
   updateReview: (req: Request, res: Response, next: NextFunction) => void;
   deleteReview: (req: Request, res: Response, next: NextFunction) => void;

}
