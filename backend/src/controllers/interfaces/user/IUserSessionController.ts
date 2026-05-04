import { Request, Response, NextFunction } from "express";

export interface IUserSessionController {
  getSessions: (req: Request, res: Response, next: NextFunction) => void;
  joinSession: (req: Request, res: Response, next: NextFunction) => void;
  leaveSession: (req: Request, res: Response, next: NextFunction) => void;
}
