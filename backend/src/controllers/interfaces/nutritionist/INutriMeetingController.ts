import { Request, Response, NextFunction } from "express";

export interface INutriMeetingController {
  getMeetings: (req: Request, res: Response, next: NextFunction) => void;

  getMeetingDetails: (req: Request, res: Response, next: NextFunction) => void;

  createMeeting: (req: Request, res: Response, next: NextFunction) => void;

  updateMeetingStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  cancelMeeting: (req: Request, res: Response, next: NextFunction) => void;

  updateMeeting: (req: Request, res: Response, next: NextFunction) => void;
}
