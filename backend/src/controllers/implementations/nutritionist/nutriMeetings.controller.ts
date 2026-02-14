import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { INutriMeetingsController } from "../../interfaces/nutritionist/INutriMeetingsController";
import { INutriMeetingsService } from "../../../services/interfaces/nutritionist/INutriMeetingsService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class NutriMeetingsController implements INutriMeetingsController {
  constructor(
    @inject(TYPES.INutriMeetingsService)
    private _nutriMeetingsService: INutriMeetingsService
  ) {}

  getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId
    const meetings = await this._nutriMeetingsService.getMeetings(userId!);
    res.status(200).json(meetings);
  });
  
  createMeeting = asyncHandler(async (req: Request, res: Response) => {
    const { title, userId, scheduledAt } = req.body;
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const nutritionistId = req.user?.userId;
    if (!title || !userId || !scheduledAt) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newMeeting = await this._nutriMeetingsService.createMeeting({
      title,
      userId,
      nutritionistId,
      scheduledAt,
    });
    res.status(201).json(newMeeting);
  });
  
}
