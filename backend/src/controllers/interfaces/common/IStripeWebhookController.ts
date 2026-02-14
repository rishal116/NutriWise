import { Request, Response, NextFunction } from "express";

export interface IStripeWebhookController {
  handle(req: Request, res: Response, next: NextFunction): void;

}
