import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileService } from "../../interfaces/user/IUserProfileService";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";
import { GetUserProfileDto } from "../../../dtos/user/profile/getUserProfile.dto";
import {
  toUserProfileDto,
  toUserProfileImageDto,
} from "../../../mapper/user/profile/userProfile.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { UpdateUserProfileDto } from "../../../dtos/user/profile/updateUserProfile.dto";
import { validateProfileImage } from "../../../validations/file/profileImage.validation";
import { UserProfileImageDto } from "../../../dtos/user/profile/userProfileImage.dto";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
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
    logger.info("Updating user profile", {
      userId,
      fieldsUpdated: Object.keys(data),
    });
    await validateDto(UpdateUserProfileDto, data);
    const userData = await this._userRepository.findById(userId);
    if (!userData) {
      logger.warn("User not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const updatedUser = await this._userRepository.updateById(userId, {
      fullName: data.fullName ?? userData.fullName,
      phone: data.phone ?? userData.phone,
      birthDate: data.birthDate ? new Date(data.birthDate) : userData.birthDate,
      gender: data.gender ?? userData.gender,
    });
    if (!updatedUser) {
      logger.error("Failed to update user profile", { userId });
      throw new CustomError(
        "Failed to update profile",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    return toUserProfileDto(updatedUser);
  }

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileImageDto> {
    logger.info("Updating user profile image", { userId });

    validateProfileImage(file);

    let cloudinaryUrl: string;

    try {
      cloudinaryUrl = await uploadToCloudinary(file, "user-profile-images");
    } catch (error) {
      logger.error("Cloudinary upload failed", {
        userId,
        error: error instanceof Error ? error.message : error,
      });

      throw new CustomError(
        "Failed to upload profile image",
        StatusCode.BAD_GATEWAY,
      );
    }

    const updatedUser = await this._userRepository.updateById(userId, {
      profileImage: cloudinaryUrl,
    });

    if (!updatedUser) {
      logger.error("Failed to persist profile image", { userId });

      throw new CustomError(
        "Failed to update profile image",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return toUserProfileImageDto(cloudinaryUrl);
  }
}
