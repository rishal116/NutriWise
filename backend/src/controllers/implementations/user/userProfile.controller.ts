import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileController } from "../../interfaces/user/IUserProfileController";
import { IUserProfileService } from "../../../services/interfaces/user/IUserProfileService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import {
  AUTH_MESSAGES,
  USER_MESSAGES,
  COMMON_MESSAGES,
} from "../../../constants";

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.IUserProfileService)
    private _userProfileService: IUserProfileService
  ) {}

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const { userId } = req.user;
    const user = await this._userProfileService.getUserProfile(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      user,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const { userId } = req.user;
    const profileData = req.body;

    const updatedUser = await this._userProfileService.updateUserProfile(
      userId,
      profileData
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      user: updatedUser,
    });
  });

  getUserProfileImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const { userId } = req.user;
    const imageData =
      await this._userProfileService.getNutritionistProfileImage(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: imageData,
    });
  });

  updateUserProfileImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const userId = req.user.userId;

    if (!req.file) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: COMMON_MESSAGES.VALIDATION_FAILED,
      });
    }

    const updatedProfile =
      await this._userProfileService.updateNutritionistProfileImage(
        userId,
        req.file
      );

    if (!updatedProfile) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: COMMON_MESSAGES.SOMETHING_WENT_WRONG,
      });
    }

    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: updatedProfile,
    });
  });
  
}
