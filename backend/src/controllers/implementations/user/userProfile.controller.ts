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
    private _userProfileService: IUserProfileService
  ) {}
  
  getMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const user = await this._userProfileService.getMyProfile(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      user,
    });
  });

  updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const profileData = req.body;
    const updatedUser = await this._userProfileService.updateMyProfile(
      userId,
      profileData
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      user: updatedUser,
    });
  });

  getMyProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const imageData = await this._userProfileService.getMyProfileImage(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: imageData,
    });
  });

  updateMyProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const updatedProfile = await this._userProfileService.updateMyProfileImage(
      userId,
      req.file!
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: updatedProfile,
    });
  });
  
}
