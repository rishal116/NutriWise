import { Request, Response, NextFunction } from "express";

export interface IUserMeetingController {
  getMeetings: (req: Request, res: Response, next: NextFunction) => void;
  getMeetingDetails: (req: Request, res: Response, next: NextFunction) => void;
}
