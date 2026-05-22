import { Request, Response, NextFunction } from "express";

export interface IUserSessionController {
  getPublicSessions: (req: Request, res: Response, next: NextFunction) => void;
  getMySessions: (req: Request, res: Response, next: NextFunction) => void;
  getPublicSessionDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  getMySessionDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  joinFreeSession: (req: Request, res: Response, next: NextFunction) => void;
  createPaidSessionPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  verifySessionPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  leaveSession: (req: Request, res: Response, next: NextFunction) => void;
  getSessionAccess: (req: Request, res: Response, next: NextFunction) => void;
}
