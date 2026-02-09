import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileService } from "../../interfaces/user/IUserProfileService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/IHealthDetailsRepository";
import { log } from "winston";


@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.IHealthDetailsRepository)
    private _healthDetails: IHealthDetailsRepository

  ) {}
  
  
  async getUserProfile(userId: string) {
    logger.info(`Fetching profile for user: ${userId}`);
    const user = await this._userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      gender: user.gender,
      age: user.age,
    };
  }

  async updateUserProfile(userId: string, data: any) {
    console.log(data);
    
    logger.info(`Updating profile for user: ${userId}`);

    const user = await this._userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);

    const updatedProfile = {
      fullName: data.fullName ?? user.fullName,
      phone: data.phone ?? user.phone,
      birthdate: data.birthdate ?? user.birthdate,
      gender: data.gender ?? user.gender,
      age: data.age ?? user.age,
    };
    

    const updatedUser = await this._userRepository.updateById(userId, updatedProfile);

    return {
      fullName: updatedUser!.fullName,
      email: updatedUser!.email,
      phone: updatedUser!.phone,
      birthdate: updatedUser!.birthdate,
      gender: updatedUser!.gender,
      age: updatedUser!.age,

    };
  }

    async getNutritionistProfileImage(userId: string) {
      console.log("userId: ",userId);
      
    const result = await this._healthDetails.getProfileImageByUserId(userId);
    console.log(result);
    
    if (!result || !result.profileImage) {
      logger.warn(`No profile image found for user ${userId}`);
      return { profileImage: "/images/images.jpg" };
    }
    logger.info(`Fetched Cloudinary profile image for user ${userId}`);
    return { profileImage: result.profileImage}
  }


  async updateNutritionistProfileImage(userId: string, file: Express.Multer.File) {
    logger.info(`Starting profile image update for user ${userId}`);
    if (!file) {
      logger.warn(`No file provided by user ${userId}`);
      throw new Error("No file provided");
    }
    try {
      const cloudinaryUrl = await uploadToCloudinary(file, "user-profile-images");
      const updatedProfile = await this._healthDetails.updateByUserId(userId, {
        profileImage: cloudinaryUrl,
      });
      console.log("db updated: ",updatedProfile);
      
      if (!updatedProfile) {
        logger.error(`DB update failed for user ${userId}`);
        throw new Error("Failed to update profile image in database");
      }
      logger.info(`Profile image updated successfully for user ${userId}`);
      return {
        profileImage: cloudinaryUrl,
        message: "Profile image updated successfully",
      };
    } catch (error) {
      logger.error(`Error updating profile image for user ${userId}`, error);
      throw error;
    }
  }
}
