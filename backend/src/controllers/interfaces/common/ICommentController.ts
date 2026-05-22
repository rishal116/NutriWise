import { Request, Response, NextFunction } from "express";

export interface ICommentController {
  addComment(req: Request, res: Response, next: NextFunction): void;
  getPostComments(req: Request, res: Response, next: NextFunction): void;
  deleteComment(req: Request, res: Response, next: NextFunction): void;
}
