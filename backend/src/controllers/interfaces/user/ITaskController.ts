
import { Request, Response, NextFunction } from "express";

export interface ITaskController {
   getTodayTasks: (req: Request, res: Response, next: NextFunction) => void;
   updateTodayTasks: (req: Request, res: Response, next: NextFunction) => void;
}
