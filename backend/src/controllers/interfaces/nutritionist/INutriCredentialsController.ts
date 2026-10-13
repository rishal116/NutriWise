import type { Request, Response, NextFunction } from "express";

export interface INutriCredentialsController {
  getCredentials(req: Request, res: Response, next: NextFunction): void;
}
