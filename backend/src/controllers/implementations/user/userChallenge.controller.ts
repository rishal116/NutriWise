import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { IUserChallengeController } from "../../interfaces/user/IUserChallengeController";

import { IUserChallengeService } from "../../../services/interfaces/user/challenge/IUserChallengeService";

@injectable()
export class UserChallengeController implements IUserChallengeController {
  constructor(
    @inject(TYPES.IUserChallengeService)
    private readonly _userChallengeService: IUserChallengeService,
  ) {}

  joinChallenge = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { challengeId } = req.params;

    const result = await this._userChallengeService.joinChallenge(
      userId,
      challengeId,
    );

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Challenge joined successfully",
      data: result,
    });
  });

  browseChallenges = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await this._userChallengeService.browseChallenges(
      userId,
      req.query,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "User challenges fetched successfully",
      data: result,
    });
  });

  getChallenge = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { userChallengeId } = req.params;

    const result = await this._userChallengeService.getChallenge(
      userId,
      userChallengeId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "User challenge fetched successfully",
      data: result,
    });
  });
}
