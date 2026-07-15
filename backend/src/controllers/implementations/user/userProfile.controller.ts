import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileController } from "../../interfaces/user/IUserProfileController";
import { IUserProfileService } from "../../../services/interfaces/user/IUserProfileService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { USER_MESSAGES, COMMON_MESSAGES } from "../../../constants";

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.IUserProfileService)
    private _userProfileService: IUserProfileService,
  ) {}

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const user = await this._userProfileService.getProfile(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: user,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const profileData = req.body;
    const updatedUser = await this._userProfileService.updateProfile(
      userId,
      profileData,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: updatedUser,
    });
  });

  updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const updatedProfile = await this._userProfileService.updateProfileImage(
      userId,
      req.file!,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: updatedProfile,
    });
  });
}
