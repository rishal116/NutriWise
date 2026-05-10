import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../../types/types";

import { IClientProfileController } from "../../interfaces/user/IClientProfileController";
import { IClientProfileService } from "../../../services/interfaces/user/IClientProfileService";

import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  UpdateProfileCompletionDTO,
} from "../../../dtos/user/clientProfile.dto";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { COMMON_MESSAGES, USER_MESSAGES } from "../../../constants";

@injectable()
export class ClientProfileController implements IClientProfileController {
  constructor(
    @inject(TYPES.IClientProfileService)
    private _clientProfileService: IClientProfileService,
  ) {}

  getMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const data = await this._clientProfileService.getMyProfile(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data,
    });
  });

  createProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;


    const payload: CreateClientProfileDTO = req.body;

    const data = await this._clientProfileService.createProfile(
      userId,
      payload,
    );

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: USER_MESSAGES.CLIENT_PROFILE_CREATED,
      data,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const payload: UpdateClientProfileDTO = req.body;

    const data = await this._clientProfileService.updateProfile(
      userId,
      payload,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.CLIENT_PROFILE_UPDATED,
      data,
    });
  });

  updateProfileCompletion = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.user!;

      const payload: UpdateProfileCompletionDTO = req.body;

      const data = await this._clientProfileService.updateProfileCompletion(
        userId,
        payload,
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: USER_MESSAGES.CLIENT_PROFILE_COMPLETION_UPDATED,
        data,
      });
    },
  );

  deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    await this._clientProfileService.deleteProfile(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.CLIENT_PROFILE_DELETED,
    });
  });
}
