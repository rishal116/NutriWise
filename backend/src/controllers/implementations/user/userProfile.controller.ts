import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import type { IUserProfileController } from "../../interfaces/user/IUserProfileController";
import type { IUserProfileService } from "../../../services/interfaces/user/IUserProfileService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";
import { USER_MESSAGES, COMMON_MESSAGES } from "../../../constants";

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.IUserProfileService)
    private readonly _userProfileService: IUserProfileService,
  ) {}

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const user = await this._userProfileService.getProfile(userId);
    return sendResponse(res, StatusCode.OK, COMMON_MESSAGES.SUCCESS, user);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const updatedUser = await this._userProfileService.updateProfile(
      userId,
      req.body,
    );
    return sendResponse(
      res,
      StatusCode.OK,
      USER_MESSAGES.PROFILE_UPDATED,
      updatedUser,
    );
  });

  updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const updatedProfile = await this._userProfileService.updateProfileImage(
      userId,
      req.file!,
    );
    return sendResponse(
      res,
      StatusCode.OK,
      USER_MESSAGES.PROFILE_UPDATED,
      updatedProfile,
    );
  });
}
