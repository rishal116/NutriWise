import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { IAdminChallengeController } from "../../interfaces/admin/IAdminChallengeController";

import { IAdminChallengeService } from "../../../services/interfaces/admin/IAdminChallengeService";

import { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";

import { CreateChallengeDTO } from "../../../dtos/admin/challenge/create-challenge.dto";

import { UpdateChallengeDTO } from "../../../dtos/admin/challenge/update-challenge.dto";

@injectable()
export class AdminChallengeController implements IAdminChallengeController {
  constructor(
    @inject(TYPES.IAdminChallengeService)
    private readonly _challengeService: IAdminChallengeService,
  ) {}

  updateChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const data: UpdateChallengeDTO = req.body;

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };

    const thumbnailFile = files.thumbnail?.[0];
    const coverImageFile = files.coverImage?.[0];

    const result = await this._challengeService.updateChallenge(
      challengeId,
      data,
      thumbnailFile,
      coverImageFile,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge updated successfully",
      data: result,
    });
  });

  createChallenge = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!.userId;

    const data: CreateChallengeDTO = req.body;

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };

    const thumbnailFile = files.thumbnail?.[0];
    const coverImageFile = files.coverImage?.[0];

    const result = await this._challengeService.createChallenge(
      data,
      adminId,
      thumbnailFile,
      coverImageFile,
    );

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "Challenge created successfully",
      data: result,
    });
  });

  listChallenges = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminChallengeListQueryDTO = {
      search: req.query.search as string | undefined,

      category: req.query.category as
        | AdminChallengeListQueryDTO["category"]
        | undefined,

      difficulty: req.query.difficulty as
        | AdminChallengeListQueryDTO["difficulty"]
        | undefined,

      accessType: req.query.accessType as
        | AdminChallengeListQueryDTO["accessType"]
        | undefined,

      status: req.query.status as
        | AdminChallengeListQueryDTO["status"]
        | undefined,

      sortBy: req.query.sortBy as
        | AdminChallengeListQueryDTO["sortBy"]
        | undefined,

      cursor: req.query.cursor as string | undefined,

      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const result = await this._challengeService.browseChallenges(query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenges fetched successfully",
      data: result,
    });
  });

  getChallengeDetails = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const result = await this._challengeService.getChallenge(challengeId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge details fetched successfully",
      data: result,
    });
  });

  deleteChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    await this._challengeService.deleteChallenge(challengeId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  });

  publishChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;

    const result = await this._challengeService.publishChallenge(challengeId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge published successfully",
      data: result,
    });
  });
}
