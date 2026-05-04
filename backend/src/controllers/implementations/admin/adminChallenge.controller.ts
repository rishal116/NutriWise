import { Request, Response } from "express";
import { IAdminChallengeService } from "../../../services/interfaces/admin/IAdminChallengeService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminChallengeController } from "../../interfaces/admin/IAdminChallengeController";

@injectable()
export class AdminChallengeController implements IAdminChallengeController {
  constructor(
    @inject(TYPES.IAdminChallengeService)
    private _adminChallengeService: IAdminChallengeService,
  ) {}

  createChallenge = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const adminId = req.user!.userId;

      const files = (req.files || {}) as {
        coverImage?: Express.Multer.File[];
        bannerImage?: Express.Multer.File[];
        introVideo?: Express.Multer.File[];
        mediaFiles?: Express.Multer.File[];
      };

      const challenge = await this._adminChallengeService.createChallenge(
        req.body,
        files,
        adminId,
      );

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "Challenge created successfully",
        data: challenge,
      });
    },
  );

  getChallenges = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this._adminChallengeService.getChallenges(page, limit);

    res.status(StatusCode.OK).json({
      success: true,
      ...result,
    });
  });

  getChallengeById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const challenge = await this._adminChallengeService.getChallengeById(id);

    res.status(StatusCode.OK).json({
      success: true,
      data: challenge,
    });
  });

  updateChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const updated = await this._adminChallengeService.updateChallenge(
      id,
      req.body,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge updated successfully",
      data: updated,
    });
  });

  deleteChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this._adminChallengeService.deleteChallenge(id);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  });

  publishChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const published = await this._adminChallengeService.publishChallenge(id);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Challenge published successfully",
      data: published,
    });
  });
}
