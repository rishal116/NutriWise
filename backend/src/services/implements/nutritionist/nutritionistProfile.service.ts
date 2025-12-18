import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { INutritionistProfile} from "../../../models/nutritionistProfile.model";
import { INutritionistProfileService } from "../../interfaces/nutritionist/INutritionistProfileService";
import { toNutritionistGeneralInfoDTO } from "../../../mapper/nutritionistProfile.mapper";


@injectable()
export class NutritionistProfileService implements INutritionistProfileService {
  constructor(
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository
  ) {}
  
  async getNutritionistProfile(userId: string) {
    const profile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
    if (!profile) return null;
    const dto = toNutritionistGeneralInfoDTO(profile);
    
    return dto;
  }
  
  async updateNutritionistProfile(userId: string, data: Partial<INutritionistProfile & { user?: any }>) {
    const { user: userData, ...nutritionistData } = data;
    const updatedProfile = await this._nutritionistProfileRepository.updateByUserId(userId, nutritionistData);
    if (userData) {
      await this._nutritionistProfileRepository.updateByUserId(userId, userData);
    }
    const fullProfile = await this._nutritionistProfileRepository.findCompleteProfile(userId);
    return fullProfile;
  }

}
