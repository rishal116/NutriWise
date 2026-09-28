import { Request, Response, NextFunction } from "express";

export interface IReviewController {
  createReview(req: Request, res: Response, next: NextFunction): void;

  getMyReview(req: Request, res: Response, next: NextFunction): void;

  getNutritionistReviews(req: Request, res: Response, next: NextFunction): void;

  updateReview(req: Request, res: Response, next: NextFunction): void;

  deleteReview(req: Request, res: Response, next: NextFunction): void;
}
