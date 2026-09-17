import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { IPublicChallengeController } from "../../interfaces/public/IPublicChallengeController";

import { IPublicChallengeService } from "../../../services/interfaces/public/IPublicChallengeService";

@injectable()
export class PublicChallengeController implements IPublicChallengeController {
  constructor(
    @inject(TYPES.IPublicChallengeService)
    private readonly _challengeService: IPublicChallengeService,
  ) {}

  getChallengeSections = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this._challengeService.getChallengeSections();

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge sections fetched successfully",
      data: result,
    });
  });

  getChallengeDetails = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const userId = req.user?.userId;

    const result = await this._challengeService.getChallenge(
      challengeId,
      userId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge details fetched successfully",
      data: result,
    });
  });

  getChallengeDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    const result = await this._challengeService.getChallengeDay(
      challengeId,
      dayId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge day details fetched successfully",
      data: result,
    });
  });
}
