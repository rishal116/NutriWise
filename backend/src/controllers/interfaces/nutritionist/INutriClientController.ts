import { Request, Response, NextFunction } from "express";

export interface INutriClientController {
  getClients: (req: Request, res: Response, next: NextFunction) => void;
  getClientDetails: (req: Request, res: Response, next: NextFunction) => void;
  getMeetingEligibleClients: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
