import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { IUserMeetingController } from "../../interfaces/user/IUserMeetingController";
import { IUserMeetingService } from "../../../services/interfaces/user/IUserMeetingService";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

import { UserMeetingListQueryDTO } from "../../../dtos/user/meeting/user-meeting-list-query.dto";

@injectable()
export class UserMeetingController implements IUserMeetingController {
  constructor(
    @inject(TYPES.IUserMeetingService)
    private readonly _userMeetingsService: IUserMeetingService,
  ) {}

  getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const query = req.query as unknown as UserMeetingListQueryDTO;

    const meetings = await this._userMeetingsService.getMeetings(userId, query);

    res.status(StatusCode.OK).json({
      success: true,
      data: meetings,
    });
  });

  getMeetingDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { meetingId } = req.params;

    const meeting = await this._userMeetingsService.getMeetingDetails(
      userId,
      meetingId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: meeting,
    });
  });
}
