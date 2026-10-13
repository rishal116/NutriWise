import { Request, Response, NextFunction } from "express";

export interface IGroupController {
  joinPrivateGroup: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}