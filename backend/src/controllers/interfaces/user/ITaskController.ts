
import { Request, Response, NextFunction } from "express";

export interface ITaskController {
   updateTodayTasks: (req: Request, res: Response, next: NextFunction) => void;
   getTodayTasks: (req: Request, res: Response, next: NextFunction) => void;
}
