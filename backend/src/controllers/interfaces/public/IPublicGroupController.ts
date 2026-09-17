import type { Request, Response, NextFunction } from "express";

export interface IPublicGroupController {
  browseGroups(req: Request, res: Response, next: NextFunction): void;

  getGroup(req: Request, res: Response, next: NextFunction): void;
  joinGroup(req: Request, res: Response, next: NextFunction): void;
}
