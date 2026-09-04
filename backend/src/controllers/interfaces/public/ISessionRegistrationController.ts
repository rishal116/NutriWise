import { NextFunction, Request, Response } from "express";
export interface ISessionRegistrationController {
  registerForSession(req: Request, res: Response, next: NextFunction): void;

  getMySessionRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;

  cancelSessionRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;
}
