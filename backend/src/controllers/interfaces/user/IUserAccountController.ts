import { Request, Response, NextFunction } from "express";

export interface IUserAccountController {
  changePassword(req: Request, res: Response, next: NextFunction): void;
}
