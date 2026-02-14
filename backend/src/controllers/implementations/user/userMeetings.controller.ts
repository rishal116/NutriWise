import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { IUserMeetingsController } from "../../interfaces/user/IUserMeetingsController";
import { TYPES } from "../../../types/types";
import { IUserMeetingsService } from "../../../services/interfaces/user/IUserMeetingsService";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class UserMeetingsController implements IUserMeetingsController {
  constructor(
    @inject(TYPES.IUserMeetingsService)
    private _userMeetingsService: IUserMeetingsService
  ) {}

  getMeetings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId
    const meetings = await this._userMeetingsService.getMeetings(userId!);
    res.status(200).json(meetings);
  });
}
