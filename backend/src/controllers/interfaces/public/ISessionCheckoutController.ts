import { NextFunction, Request, Response } from "express";

export interface ISessionCheckoutController {
  createCheckoutSession(req: Request, res: Response, next: NextFunction): void;
}
