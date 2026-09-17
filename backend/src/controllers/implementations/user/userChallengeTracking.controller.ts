import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { IUserChallengeTrackingController } from "../../interfaces/user/IUserChallengeTrackingController";

import { IUserChallengeTrackingService } from "../../../services/interfaces/user/challenge/IUserChallengeTrackingService";

@injectable()
export class UserChallengeTrackingController implements IUserChallengeTrackingController {
  constructor(
    @inject(TYPES.IUserChallengeTrackingService)
    private readonly _userChallengeTrackingService: IUserChallengeTrackingService,
  ) {}

  completeActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { userChallengeId, challengeDayId, activityId } = req.params;

    const result = await this._userChallengeTrackingService.completeActivity(
      userId,
      userChallengeId,
      challengeDayId,
      activityId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Activity completed successfully",
      data: result,
    });
  });

  uncompleteActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { userChallengeId, challengeDayId, activityId } = req.params;

    const result = await this._userChallengeTrackingService.uncompleteActivity(
      userId,
      userChallengeId,
      challengeDayId,
      activityId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Activity marked as incomplete",
      data: result,
    });
  });
}
