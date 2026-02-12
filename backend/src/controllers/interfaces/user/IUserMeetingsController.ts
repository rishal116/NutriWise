import { Request, Response, NextFunction } from "express";

export interface IUserMeetingsController {
  getMeetings: (req: Request, res: Response, next: NextFunction) => void;
}
