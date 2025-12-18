import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistService } from "../../interfaces/user/INutritionistsService";
import { IUserNutritionistProfileRepository } from "../../../repositories/interfaces/user/IUserNutritionistProfileRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { NutritionistUserDTO } from "../../../dtos/user/nutritionistUser.dto";
import { NutritionistFilterDTO } from "../../../dtos/user/nutritionistUser.dto";

@injectable()
export class NutritionistService implements INutritionistService {
  constructor(
    @inject(TYPES.IUserNutritionistProfileRepository)
    private readonly _nutritionistProfileRepo: IUserNutritionistProfileRepository
  ) {}

  async getAll(): Promise<NutritionistUserDTO[]> {
    logger.info("Fetching all approved nutritionists");

    const results = await this._nutritionistProfileRepo.findAllNutritionist();

    return results.map(
      (item) => new NutritionistUserDTO(item.user, item.profile)
    );
  }

  async getById(id: string): Promise<NutritionistUserDTO> {
    const result = await this._nutritionistProfileRepo.findByUserId(id);

    if (!result) {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }

    return new NutritionistUserDTO(result.user, result.profile);
  }
}
