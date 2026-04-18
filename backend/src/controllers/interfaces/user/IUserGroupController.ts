import { Request, Response, NextFunction } from "express";

export interface IUserGroupController {
  getGroups: (req: Request, res: Response, next: NextFunction) => void;
  joinGroup: (req: Request, res: Response, next: NextFunction) => void;
}
