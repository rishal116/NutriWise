import { Request, Response, NextFunction } from "express";

export interface IUserChallengeTrackingController {
  completeActivity(req: Request, res: Response, next: NextFunction): void;

  uncompleteActivity(req: Request, res: Response, next: NextFunction): void;
}
