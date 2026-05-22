import { Request, Response, NextFunction } from "express";

export interface IPostController {
  createPost(req: Request, res: Response, next: NextFunction): void;

  getPostById(req: Request, res: Response, next: NextFunction): void;

  getAllPosts(req: Request, res: Response, next: NextFunction): void;

  getMyPosts(req: Request, res: Response, next: NextFunction): void;

  updatePost(req: Request, res: Response, next: NextFunction): void;

  deletePost(req: Request, res: Response, next: NextFunction): void;

  toggleLike(req: Request, res: Response, next: NextFunction): void;
}