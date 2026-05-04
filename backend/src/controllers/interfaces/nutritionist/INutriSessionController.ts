import { Request, Response, NextFunction } from "express";

export interface INutriSessionController {
  createSession(req: Request, res: Response, next: NextFunction): void;
  getMySessions(req: Request, res: Response, next: NextFunction): void;
  getSessionDetails(req: Request, res: Response, next: NextFunction): void;
  startSession(req: Request, res: Response, next: NextFunction): void;
  endSession(req: Request, res: Response, next: NextFunction): void;
  cancelSession(req: Request, res: Response, next: NextFunction): void;
}
