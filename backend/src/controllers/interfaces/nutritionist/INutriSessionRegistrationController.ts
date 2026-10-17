import type { Request, Response, NextFunction } from "express";

export interface INutriSessionRegistrationController {
  getSessionParticipants: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
