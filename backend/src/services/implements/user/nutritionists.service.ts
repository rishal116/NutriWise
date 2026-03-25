import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistService } from "../../interfaces/user/INutritionistsService";
import { IUserNutritionistProfileRepository } from "../../../repositories/interfaces/user/IUserNutritionistProfileRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { NutritionistUserSideDTO, NutritionistUserDTO,NutritionistPlanDTO } from "../../../dtos/user/nutritionistUser.dto";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { IPlan } from "../../../models/nutritionistPlan.model";
import { NutritionistListFilter } from "../../../dtos/user/nutritionistUser.dto";
import { toNutritionistPlanDTO } from "../../../mapper/user/nutritionistPlan.mapper";

@injectable()
export class NutritionistService implements INutritionistService {
  constructor(
    @inject(TYPES.IUserNutritionistProfileRepository)
    private  _nutritionistProfileRepo: IUserNutritionistProfileRepository,
    @inject(TYPES.INutritionistPlanRepository)
    private  _nutritionistPlansRepo: INutritionistPlanRepository

  ) {}
  
  async getAll(filters: NutritionistListFilter) {
    const { page, limit } = filters;
    const { data, total } = await this._nutritionistProfileRepo.findAllNutritionist(filters);
    if (page < 1) {
      throw new Error("Invalid page number");
    }
    if (!data.length) {
      return {
        data: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }
    const dtoList = data.map(
      item => new NutritionistUserSideDTO(item.user, item.profile)
    );
    return {
      data: dtoList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async getById(id: string): Promise<NutritionistUserDTO> {
    logger.info(`Fetching nutritionist by ID: ${id}`);
    if (!id) {
      logger.error("Nutritionist ID is missing");
      throw new CustomError("Nutritionist ID is required", StatusCode.BAD_REQUEST);
    }
    const result = await this._nutritionistProfileRepo.findByUserId(id);
    if (!result) {
      logger.error(`Nutritionist not found for ID: ${id}`);
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }
    const { user, profile } = result;
    const dto = new NutritionistUserDTO(user, profile);
    logger.info(`Returning nutritionist: ${dto.fullName} (${dto.email})`);
    return dto;
  }
  
  async getPlansByNutritionist(id: string): Promise<NutritionistPlanDTO[]> {
    logger.info(`Fetching plans for nutritionist ID: ${id}`);
    if (!id) {
      logger.error("Nutritionist ID is missing");
      throw new CustomError("Nutritionist ID is required", StatusCode.BAD_REQUEST);
    }
    const plans: IPlan[] = await this._nutritionistPlansRepo.findByNutritionistId(id);
    if (!plans || plans.length === 0) {
      logger.warn(`No plans found for nutritionist ID: ${id}`);
      return [];
    }
    const mappedPlans = plans.map(toNutritionistPlanDTO);
    logger.info(`Returning ${mappedPlans.length} plans for nutritionist ID: ${id}`);
    return mappedPlans;
  }

}
