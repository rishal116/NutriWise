import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { INutriMeetingController } from "../../interfaces/nutritionist/INutriMeetingController";
import { INutriMeetingService } from "../../../services/interfaces/nutritionist/INutriMeetingService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";

@injectable()
export class NutriMeetingController implements INutriMeetingController {
  constructor(
    @inject(TYPES.INutriMeetingService)
    private _nutriMeetingsService: INutriMeetingService,
  ) {}

  getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const query = req.query as unknown as MeetingListQueryDTO;

    const meetings = await this._nutriMeetingsService.getMeetings(
      nutritionistId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: meetings,
    });
  });

  getMeetingDetails = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { meetingId } = req.params;

    const meeting = await this._nutriMeetingsService.getMeetingDetails(
      nutritionistId,
      meetingId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: meeting,
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
    const { roomId } = req.params;
    const { status } = req.body;

    const updatedMeeting = await this._nutriMeetingsService.updateMeetingStatus(
      roomId,
      status,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: updatedMeeting,
    });
  });
}
