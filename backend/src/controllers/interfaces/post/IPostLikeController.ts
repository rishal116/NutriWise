import type { Request, Response, NextFunction } from "express";

export interface IPostLikeController {
  likePost(req: Request, res: Response, next: NextFunction): void;

  unlikePost(req: Request, res: Response, next: NextFunction): void;
}
