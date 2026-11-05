import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { IUserProfileService } from "../../interfaces/user/IUserProfileService";
import type { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { deleteFromCloudinary, uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";

import type { GetUserProfileDto } from "../../../dtos/user/profile/getUserProfile.dto";
import { UpdateUserProfileDto } from "../../../dtos/user/profile/updateUserProfile.dto";
import type { UserProfileImageDto } from "../../../dtos/user/profile/userProfileImage.dto";

import {
  toUserProfileDto,
  toUserProfileImageDto,
} from "../../../mappers/user/profile/userProfile.mapper";

import { validateProfileImage } from "../../../validations/file/profileImage.validation";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async getProfile(userId: string): Promise<GetUserProfileDto> {
    logger.info("Fetching user profile", { userId });

    const user = await this._userRepository.findById(userId);

    if (!user) {
      logger.warn("User not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    return toUserProfileDto(user);
  }

  async updateProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<GetUserProfileDto> {
    const validatedData = await validateDto(UpdateUserProfileDto, data);

    logger.info("Updating user profile", {
      userId,
      fieldsUpdated: Object.keys(validatedData),
    });

    const user = await this._userRepository.findById(userId);

    if (!user) {
      logger.warn("User not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    const updatedUser = await this._userRepository.updateById(userId, {
      fullName: validatedData.fullName ?? user.fullName,
      phone: validatedData.phone ?? user.phone,
      birthDate: validatedData.birthDate
        ? new Date(validatedData.birthDate)
        : user.birthDate,
      gender: validatedData.gender ?? user.gender,
    });

    if (!updatedUser) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    return toUserProfileDto(updatedUser);
  }

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileImageDto> {
    logger.info("Updating user profile image", { userId });

    validateProfileImage(file);

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    const uploadResponse = await uploadToCloudinary(
      file,
      "user-profile-images",
    );

    const updatedUser = await this._userRepository.updateById(userId, {
      profileImage: uploadResponse.secureUrl,
      profileImagePublicId: uploadResponse.publicId,
    });

    if (!updatedUser) {
      await deleteFromCloudinary(
        uploadResponse.publicId,
        uploadResponse.resourceType,
      );

      throw new CustomError(
        "Failed to update profile image",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (user.profileImagePublicId) {
      try {
        await deleteFromCloudinary(user.profileImagePublicId, "image");
      } catch (error: unknown) {
        logger.warn("Failed to delete previous profile image from Cloudinary", {
          userId,
          publicId: user.profileImagePublicId,
          error,
        });
      }
    }

    return toUserProfileImageDto(uploadResponse.secureUrl);
  }
}
