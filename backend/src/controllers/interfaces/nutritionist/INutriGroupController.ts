import { Request, Response, NextFunction } from "express";

export interface INutriGroupController {
  createGroup: (req: Request, res: Response, next: NextFunction) => void;
  getMyGroups: (req: Request, res: Response, next: NextFunction) => void;
}