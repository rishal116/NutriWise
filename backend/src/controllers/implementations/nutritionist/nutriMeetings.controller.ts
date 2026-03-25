import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { INutriMeetingsController } from "../../interfaces/nutritionist/INutriMeetingsController";
import { INutriMeetingsService } from "../../../services/interfaces/nutritionist/INutriMeetingsService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class NutriMeetingsController implements INutriMeetingsController {
  constructor(
    @inject(TYPES.INutriMeetingsService)
    private _nutriMeetingsService: INutriMeetingsService
  ) {}

  getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user?.userId;

    const meetings = await this._nutriMeetingsService.getMeetings(
      nutritionistId!
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: meetings,
    });
  });

  createMeeting = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const meeting = await this._nutriMeetingsService.createMeeting({
      ...req.body,
      nutritionistId,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      data: meeting,
    });
  });

  updateMeetingStatus = asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const { status } = req.body;

    const updatedMeeting = await this._nutriMeetingsService.updateMeetingStatus(
      roomId,
      status
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: updatedMeeting,
    });
  });
}