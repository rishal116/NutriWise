import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { INutriMeetingController } from "../../interfaces/nutritionist/INutriMeetingController";
import { INutriMeetingService } from "../../../services/interfaces/nutritionist/INutriMeetingService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/meeting/create-meeting.dto";
import { UpdateMeetingDTO } from "../../../dtos/nutritionist/meeting/update-meeting.dto";
import { MeetingStatus } from "../../../models/meeting.model";

@injectable()
export class NutriMeetingController implements INutriMeetingController {
  constructor(
    @inject(TYPES.INutriMeetingService)
    private readonly _nutriMeetingsService: INutriMeetingService,
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
      message: "Meetings retrieved successfully",
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
      message: "Meeting details retrieved successfully",
      data: meeting,
    });
  });

  createMeeting = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const data = req.body as CreateMeetingDTO;

    await this._nutriMeetingsService.createMeeting(nutritionistId, data);

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Meeting created successfully",
    });
  });

  updateMeetingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { status } = req.body as { status: MeetingStatus };

    await this._nutriMeetingsService.updateMeetingStatus(roomId, status);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Meeting status updated successfully",
    });
  });

  updateMeeting = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { meetingId } = req.params;
    const data = req.body as UpdateMeetingDTO;

    await this._nutriMeetingsService.updateMeeting(
      nutritionistId,
      meetingId,
      data,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Meeting updated successfully",
    });
  });

  cancelMeeting = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { meetingId } = req.params;
    const { cancellationReason } = req.body;

    await this._nutriMeetingsService.cancelMeeting(
      nutritionistId,
      meetingId,
      cancellationReason,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Meeting cancelled successfully",
    });
  });
}
