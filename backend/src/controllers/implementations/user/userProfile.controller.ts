import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileController } from "../../interfaces/user/IUserProfileController";
import { IUserProfileService } from "../../../services/interfaces/user/IUserProfileService";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.IUserProfileService) private _userProfileService: IUserProfileService
  ) {}

  getProfile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user?.userId; 

    logger.info(`Fetching profile for user: ${userId}`);

    const user = await this._userProfileService.getUserProfile(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  });

  updateProfile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const profileData = req.body;

    logger.info(`Updating profile for user: ${userId}`);

    const updatedUser = await this._userProfileService.updateUserProfile(userId, profileData);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  });
}
