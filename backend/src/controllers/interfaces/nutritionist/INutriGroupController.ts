import { NextFunction, Request, Response } from "express";

export interface INutriGroupController {
  createGroup(req: Request, res: Response, next: NextFunction): void;

  browseGroups(req: Request, res: Response, next: NextFunction): void;

  getGroup(req: Request, res: Response, next: NextFunction): void;
}
