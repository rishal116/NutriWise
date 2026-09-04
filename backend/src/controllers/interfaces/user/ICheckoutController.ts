import { NextFunction, Request, Response } from "express";

export interface ICheckoutController {
  createCheckoutSession(req: Request, res: Response, next: NextFunction): void;
}
