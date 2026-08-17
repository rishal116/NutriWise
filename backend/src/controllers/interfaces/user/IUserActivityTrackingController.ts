import { Request, Response, NextFunction } from "express";

export interface IUserActivityTrackingController {
  startActivity: (req: Request, res: Response, next: NextFunction) => void;

  updateActivity: (req: Request, res: Response, next: NextFunction) => void;
  skipActivity: (req: Request, res: Response, next: NextFunction) => void;
  getActivityTracking: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  getDayActivityTracking: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
