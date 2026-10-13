import type { Request, Response, NextFunction } from "express";

export interface IPublicPostController {
  browsePosts(req: Request, res: Response, next: NextFunction): void;

  getPost(req: Request, res: Response, next: NextFunction): void;

  browsePostsByAuthor(req: Request, res: Response, next: NextFunction): void;
}
