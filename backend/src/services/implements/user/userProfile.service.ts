import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileService } from "../../interfaces/user/IUserProfileService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IClientProfileRepository } from "../../../repositories/interfaces/user/IClientProfileRepository";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads";

import {
  UserProfile,
  UpdateUserProfileDto,
  UserProfileImage,
} from "../../../dtos/user/userProfile.dto";

import { toUserProfileResponse } from "../../../mapper/user/userProfile.mapper";
import { validateUpdateProfile } from "../../../validations/user/userProfile.validation";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.IClientProfileRepository)
    private _clientProfileRepo: IClientProfileRepository
  ) {}

  async getMyProfile(userId: string): Promise<UserProfile> {
    logger.info("Fetching user profile", { userId });

    const userData = await this._userRepository.findById(userId);

    if (!userData) {
      logger.warn("User not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    return toUserProfileResponse(userData);
  }

  async updateMyProfile(
    userId: string,
    data: UpdateUserProfileDto
  ): Promise<UserProfile> {
    logger.info("Updating user profile", {
      userId,
      fieldsUpdated: Object.keys(data),
    });

    validateUpdateProfile(data);

    const userData = await this._userRepository.findById(userId);

    if (!userData) {
      logger.warn("User not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    const updatedUser = await this._userRepository.updateById(userId, {
      fullName: data.fullName ?? userData.fullName,
      phone: data.phone ?? userData.phoneNumber,
    });

    const updatedProfile = await this._clientProfileRepo.updateByUserId(userId, {
      dateOfBirth: data.birthdate ?? undefined,
      gender: data.gender ?? undefined,
    });



    if (!updatedUser) {
      logger.error("Failed to update user profile", { userId });
      throw new CustomError(
        "Failed to update profile",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

       if (!updatedProfile) {
      logger.error("Failed to update user birthdate and gender", { userId });
      throw new CustomError(
        "Failed to update user birthdate and gender",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return toUserProfileResponse(updatedUser);
  }

  async getMyProfileImage(userId: string): Promise<UserProfileImage> {
    logger.info("Fetching user profile image", { userId });

    const userData =
      await this._userRepository.getProfileImageById(userId);

    if (!userData?.profileImageUrl) {
      logger.warn("Profile image not found", { userId });
      return { profileImage: "/images/images.jpg" };
    }

    return { profileImage: userData.profileImageUrl };
  }

  async updateMyProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<UserProfileImage> {
    logger.info("Updating user profile image", { userId });

    let cloudinaryUrl: string;

    try {
      cloudinaryUrl = await uploadToCloudinary(
        file,
        "user-profile-images"
      );
    } catch (error) {
      logger.error("Cloudinary upload failed", {
        userId,
        error: error instanceof Error ? error.message : error,
      });

      throw new CustomError(
        "Failed to upload profile image",
        StatusCode.BAD_GATEWAY
      );
    }

    const updatedUser = await this._userRepository.updateById(userId, {
      profileImageUrl: cloudinaryUrl,
    });

    if (!updatedUser) {
      logger.error("Failed to persist profile image", { userId });
      throw new CustomError(
        "Failed to update profile image",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return { profileImage: cloudinaryUrl };
  }
}