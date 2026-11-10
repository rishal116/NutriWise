import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

import type { IAdminChallengeDayController } from "../../interfaces/admin/IAdminChallengeDayController";
import type { IAdminChallengeDayService } from "../../../services/interfaces/admin/IAdminChallengeDayService";

import type { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";
import type { CreateChallengeDayDTO } from "../../../dtos/admin/challenge-day/create-challenge-day.dto";
import type { UpdateChallengeDayDTO } from "../../../dtos/admin/challenge-day/update-challenge-day.dto";
import type { ChallengeDayUploadedFiles } from "../../../types/admin/challenge-day/challenge-day-files.types";

import { ADMIN_CHALLENGE_DAY_MESSAGES } from "../../../constants/admin/challenge-day.constants";

@injectable()
export class AdminChallengeDayController implements IAdminChallengeDayController {
  constructor(
    @inject(TYPES.IAdminChallengeDayService)
    private readonly _challengeDayService: IAdminChallengeDayService,
  ) {}

  createDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const data: CreateChallengeDayDTO = {
      dayNumber: Number(req.body.dayNumber),
      title: req.body.title,
      description: req.body.description,
      activities: req.body.activities,
      activityMediaIndexes: req.body.activityMediaIndexes,
    };

    const files = req.files as ChallengeDayUploadedFiles | undefined;

    await this._challengeDayService.createDay(challengeId, data, files);

    return sendResponse(
      res,
      StatusCode.CREATED,
      ADMIN_CHALLENGE_DAY_MESSAGES.CREATED,
    );
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

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_DAY_MESSAGES.FETCHED,
      result,
    );
  });

  getDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    const result = await this._challengeDayService.getDay(challengeId, dayId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_DAY_MESSAGES.DETAILS_FETCHED,
      result,
    );
  });

  updateDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    const data: UpdateChallengeDayDTO = {
      title: req.body.title,
      description: req.body.description,
      activities: req.body.activities,
      activityMediaIndexes: req.body.activityMediaIndexes,
    };

    const files = req.files as ChallengeDayUploadedFiles | undefined;

    await this._challengeDayService.updateDay(challengeId, dayId, data, files);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_DAY_MESSAGES.UPDATED,
    );
  });

  deleteDay = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId, dayId } = req.params;

    await this._challengeDayService.deleteDay(challengeId, dayId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_DAY_MESSAGES.DELETED,
    );
  });
}
