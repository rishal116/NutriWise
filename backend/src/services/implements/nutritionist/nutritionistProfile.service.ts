import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { INutritionistDetails } from "../../../models/nutritionistDetails.model";
import { INutritionistProfileService } from "../../interfaces/nutritionist/INutritionistProfileService";
import { toNutritionistProfileDTO } from "../../../mapper/nutritionistProfile.mapper";


@injectable()
export class NutritionistProfileService implements INutritionistProfileService {
  constructor(
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository
  ) {}
  
  async getNutritionistProfile(userId: string) {
    const profile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
    if (!profile) return null;
    const dto = toNutritionistProfileDTO(profile);
    console.log("details",dto);
    
    return dto;
  }
  
  async updateNutritionistProfile(userId: string, data: Partial<INutritionistDetails & { user?: any }>) {
    const { user: userData, ...nutritionistData } = data;
    const updatedProfile = await this._nutritionistProfileRepository.updateByUserId(userId, nutritionistData);
    if (userData) {
      await this._nutritionistProfileRepository.updateById(userId, userData);
    }
    const fullProfile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
    return fullProfile;
  }

}
