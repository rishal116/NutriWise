import { Request, Response, NextFunction } from "express";

export interface IPublicSessionController {
  getPublicSessions: (req: Request, res: Response, next: NextFunction) => void;
  getPublicSessionDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
