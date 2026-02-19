import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { INutritionistProfileService } from "../../interfaces/nutritionist/INutritionistProfileService";
import { toNutritionistGeneralInfoDTO } from "../../../mapper/nutritionistProfile.mapper";
import logger from "../../../utils/logger";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";

interface UpdateNutritionistInput {
  fullName?: string;
  gender?: string;
  phone?: string;
  bio?: string;
  languages?: string[];
}

@injectable()
export class NutritionistProfileService implements INutritionistProfileService {
  constructor(
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
    @inject(TYPES.IUserRepository)
    private _userRepository : IUserRepository
  ) {}
  
  async getNutritionistProfile(userId: string) {
    const profile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
    if (!profile) {
      logger.warn(`No profile found for user ${userId}`);
      return null;
    }
    logger.info(`Fetched profile for user ${userId}`);
    return toNutritionistGeneralInfoDTO(profile);
  }
  
  
  async updateNutritionistProfile(userId: string, data: UpdateNutritionistInput) {
    try {
      const { fullName, gender, phone,bio,languages} = data;
      await this._nutritionistProfileRepository.updateByUserId(userId, {
        bio: bio ?? "",
        languages: languages ?? [],
      });
      await this._userRepository.updateById(userId, {
        fullName: fullName ?? "",
        gender: gender ?? "",
        phone: phone ?? "",
      });
      logger.info(`Updated profile for user ${userId}`);
      const fullProfile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
      return fullProfile;
    } catch (err) {
      logger.error(`Failed to update profile for user ${userId}: ${err}`);
      throw err;
    }
  }

  async getNutritionistProfileImage(userId: string) {
    const result = await this._nutritionistProfileRepository.getProfileImageByUserId(userId);
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
      const cloudinaryUrl = await uploadToCloudinary(file, "nutritionist-profile-images");
      const updatedProfile = await this._nutritionistProfileRepository.updateByUserId(userId, {
        profileImage: cloudinaryUrl,
      });
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
