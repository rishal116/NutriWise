import { Request, Response, NextFunction } from "express";

export interface INutriSessionController {
  createSession: (req: Request, res: Response, next: NextFunction) => void;
  getSessions: (req: Request, res: Response, next: NextFunction) => void;
  getSessionDetails: (req: Request, res: Response, next: NextFunction) => void;
  updateSession: (req: Request, res: Response, next: NextFunction) => void;
  deleteSession: (req: Request, res: Response, next: NextFunction) => void;
  publishSession: (req: Request, res: Response, next: NextFunction) => void;
}
