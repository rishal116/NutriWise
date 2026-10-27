import type { Request, Response, NextFunction } from "express";

export interface IResourceLikeController {
  likeResource(req: Request, res: Response, next: NextFunction): void;

  unlikeResource(req: Request, res: Response, next: NextFunction): void;
}
