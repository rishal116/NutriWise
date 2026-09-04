import { Request, Response, NextFunction } from "express";

export interface IUserPostController {
  createPost: (req: Request, res: Response, next: NextFunction) => void;
  browseMyPosts: (req: Request, res: Response, next: NextFunction) => void;
  findMyPostDetails: (req: Request, res: Response, next: NextFunction) => void;
  updatePost: (req: Request, res: Response, next: NextFunction) => void;
  deletePost: (req: Request, res: Response, next: NextFunction) => void;
}
