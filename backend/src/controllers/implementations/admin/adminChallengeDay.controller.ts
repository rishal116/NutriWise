import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { IAdminChallengeDayController } from "../../interfaces/admin/IAdminChallengeDayController";

import { IAdminChallengeDayService } from "../../../services/interfaces/admin/IAdminChallengeDayService";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";

import { CreateChallengeDayDTO } from "../../../dtos/admin/challenge-day/create-challenge-day.dto";

import { UpdateChallengeDayDTO } from "../../../dtos/admin/challenge-day/update-challenge-day.dto";

import { ChallengeDayUploadedFiles } from "../../../types/admin/challenge-day/challenge-day-files.types";

@injectable()
export class AdminChallengeDayController implements IAdminChallengeDayController {
  constructor(
    @inject(TYPES.IAdminChallengeDayService)
    private readonly _challengeDayService: IAdminChallengeDayService,
  ) {}

  createDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const data: CreateChallengeDayDTO = {
      dayNumber: Number(req.body.dayNumber),
      title: req.body.title,
      description: req.body.description,
      activities: req.body.activities,
      activityMediaIndexes: req.body.activityMediaIndexes,
    };

    const files = req.files as ChallengeDayUploadedFiles | undefined;

    const result = await this._challengeDayService.createDay(
      challengeId,
      data,
      files,
    );

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Challenge day created successfully",
      data: result,
    });
  });

  listDays = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const query: AdminChallengeDayListQueryDTO = {
      sortBy: req.query.sortBy as
        | AdminChallengeDayListQueryDTO["sortBy"]
        | undefined,
      cursor: req.query.cursor as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const result = await this._challengeDayService.browseDays(
      challengeId,
      query,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge days fetched successfully",
      data: result,
    });
  });

  getDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    const result = await this._challengeDayService.getDay(challengeId, dayId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge day details fetched successfully",
      data: result,
    });
  });

  updateDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    const data: UpdateChallengeDayDTO = {
      title: req.body.title,
      description: req.body.description,
      activities: req.body.activities,
    };

    const files = req.files as ChallengeDayUploadedFiles | undefined;

    const result = await this._challengeDayService.updateDay(
      challengeId,
      dayId,
      data,
      files,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge day updated successfully",
      data: result,
    });
  });

  deleteDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    await this._challengeDayService.deleteDay(challengeId, dayId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge day deleted successfully",
    });
  });
}
