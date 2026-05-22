import { Request, Response, NextFunction } from "express";

export interface IAdminTaskController {
  createTask(req: Request, res: Response, next: NextFunction): void;
  getTasksByChallenge(req: Request, res: Response, next: NextFunction): void;
  getTaskById(req: Request, res: Response, next: NextFunction): void;
  updateTask(req: Request, res: Response, next: NextFunction): void;
  deleteTask(req: Request, res: Response, next: NextFunction): void;
}
