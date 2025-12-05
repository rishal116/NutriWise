import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistService } from "../../interfaces/user/INutritionistsService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

export interface NutritionistDto {
  id: string;
  name: string;
  expertise: string[]; 
  rating?: number;
  location?: string;
}

@injectable()
export class NutritionistService implements INutritionistService {

  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.INutritionistDetailsRepository)
    private _nutritionistDetailsRepository: INutritionistDetailsRepository
  ) {}
  
  async getAll(filters?: any): Promise<NutritionistDto[]> {
    logger.info("Fetching all nutritionists");
    const users = await this._userRepository.findNutritionists({
      nutritionistStatus: "approved",
      isBlocked: false,
    });
    if (!users.length) return [];
    
    const result = await Promise.all(
      users.map(async (user) => {
        const details = await this._nutritionistDetailsRepository.findByUserId( 
          user._id!.toString()
        );
        
        return {
          user,
          details,
        };
      })
    );
    
    let filtered = result;
    if (filters?.location) {
      filtered = filtered.filter(r =>
        r.details?.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        r.details?.location?.state?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters?.expertise) {
      filtered = filtered.filter(
        r => r.details?.specializations?.includes(filters.expertise)
      );
    }
    
    if (filters?.minExperience) {
      filtered = filtered.filter(
        r => r.details?.totalExperienceYears! >= Number(filters.minExperience)
      );
    }
    
    return filtered.map(r => ({
      id: r.user._id!.toString(),
      name: r.user.fullName,
      expertise: r.details?.specializations || [],
      rating: r.details?.videoCallRate || 0,
      location: r.details?.location ? `${r.details.location.city}, ${r.details.location.state}` : "",
    }));
  }


async getById(id: string): Promise<NutritionistDto> {
  
  
  logger.info(`Fetching nutritionist by ID: ${id}`);

  const user = await this._userRepository.findById(id);
  if (!user || user.role !== "nutritionist") {
    throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
  }

  const details = await this._nutritionistDetailsRepository.findByUserId(id);

  return {
    id: user._id!.toString(),
    name: user.fullName,
    expertise: details?.specializations || [], // ✅ fixed
    rating: details?.videoCallRate || 0,
    location: details?.location
      ? `${details.location.city}, ${details.location.state}`
      : "",
  };
}
}
