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
  expertise: string;
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

  async getAll(): Promise<NutritionistDto[]> {
  logger.info("Fetching all nutritionists");
  const users = (await this._userRepository.getAllNutritionists()) || [];
  const filteredUsers = users.filter(
    user => user.nutritionistStatus === "approved" && !user.blocked
  );

  const result: NutritionistDto[] = await Promise.all(
    filteredUsers.map(async (user) => {
      const details = await this._nutritionistDetailsRepository.findByUserId(user._id!.toString());
      return {
        id: user._id!.toString(),
        name: user.fullName || "Unknown",
        expertise: details?.specializations?.join(", ") || "General",
        rating: details?.videoCallRate || 0,
        location: details?.bio || "",
      };
    })
  );

  return result;
}

  async getById(id: string): Promise<NutritionistDto> {
    logger.info(`Fetching nutritionist by ID: ${id}`);

    const user = await this._userRepository.findById(id);
    if (!user || user.role !== "nutritionist") {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }

    const details = await this._nutritionistDetailsRepository.findByUserId(id);

    return {
      id: user._id.toString(),
      name: user.fullName,
      expertise: details?.specializations.join(", ") || "General",
      rating: details?.videoCallRate,
      location: details?.bio || "",
    };
  }
}
