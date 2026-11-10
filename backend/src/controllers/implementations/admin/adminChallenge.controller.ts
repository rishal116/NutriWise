import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { sendResponse } from "../../../utils/responseHandler";

import type { IAdminChallengeController } from "../../interfaces/admin/IAdminChallengeController";
import type { IAdminChallengeService } from "../../../services/interfaces/admin/IAdminChallengeService";

import type { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";
import type { CreateChallengeDTO } from "../../../dtos/admin/challenge/create-challenge.dto";
import type { UpdateChallengeDTO } from "../../../dtos/admin/challenge/update-challenge.dto";

import { toAdminChallengeListQuery } from "../../../utils/adminChallengeController.util";
import { ADMIN_CHALLENGE_MESSAGES } from "../../../constants/admin/challenge.constants"; 

@injectable()
export class AdminChallengeController implements IAdminChallengeController {
  constructor(
    @inject(TYPES.IAdminChallengeService)
    private readonly _challengeService: IAdminChallengeService,
  ) {}

  updateChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const data: UpdateChallengeDTO = req.body;

    const files = req.files as
      | {
          thumbnail?: Express.Multer.File[];
        }
      | undefined;

    await this._challengeService.updateChallenge(
      challengeId,
      data,
      files?.thumbnail?.[0],
    );

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_MESSAGES.UPDATED,
    );
  });

  createChallenge = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!.userId;
    const data: CreateChallengeDTO = req.body;

    const files = req.files as
      | {
          thumbnail?: Express.Multer.File[];
        }
      | undefined;

    await this._challengeService.createChallenge(
      data,
      adminId,
      files?.thumbnail?.[0],
    );

    return sendResponse(
      res,
      StatusCode.CREATED,
      ADMIN_CHALLENGE_MESSAGES.CREATED,
    );
  });

  listChallenges = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminChallengeListQueryDTO = toAdminChallengeListQuery(
      req.query,
    );

    const result = await this._challengeService.browseChallenges(query);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_MESSAGES.FETCHED,
      result,
    );
  });

  getChallengeDetails = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const result = await this._challengeService.getChallenge(challengeId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_MESSAGES.DETAILS_FETCHED,
      result,
    );
  });

  deleteChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    await this._challengeService.deleteChallenge(challengeId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_MESSAGES.DELETED,
    );
  });

  publishChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    await this._challengeService.publishChallenge(challengeId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_CHALLENGE_MESSAGES.PUBLISHED,
    );
  });
}