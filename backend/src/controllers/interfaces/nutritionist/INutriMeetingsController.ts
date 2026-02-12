import { Request, Response, NextFunction } from "express";

export interface INutriMeetingsController {
  getMeetings: (req: Request, res: Response, next: NextFunction) => void;
  createMeeting: (req: Request, res: Response, next: NextFunction) => void;
}
