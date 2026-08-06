import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { NutritionistPlanDTO } from "../../../../dtos/user/nutri-browsing/nutri-plan.dto";
import { toNutritionistPlanDTO } from "../../../../mapper/user/nutri-browsing/nutri-plan.mapper.dto";
import { INutritionistPlanBrowsingRepository } from "../../../../repositories/interfaces/user/discovery/INutriPlanBrowsingRepository";
import { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";
import { INutritionistPlanBrowsingService } from "../../../interfaces/user/discovery/INutritionistPlanBrowsingService";

@injectable()
export class NutritionistPlanBrowsingService implements INutritionistPlanBrowsingService {
  constructor(
    @inject(TYPES.INutritionistPlanBrowsingRepository)
    private readonly _nutritionistPlanBrowsingRepository: INutritionistPlanBrowsingRepository,

    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async getPlans(username: string): Promise<NutritionistPlanDTO[]> {
    const nutritionist = await this._userRepository.findByUsername(username);
    if (!nutritionist) {
      logger.warn(`Nutritionist not found for username: ${username}`);
      throw new CustomError("Nutritionist not found.", StatusCode.NOT_FOUND);
    }
    const plans =
      await this._nutritionistPlanBrowsingRepository.findByNutritionistId(
        nutritionist._id,
      );
    logger.debug(
      `Retrieved ${plans.length} plan(s) for nutritionist: ${username}`,
    );
    return plans.map(toNutritionistPlanDTO);
  }

  async getPlanBySlug(slug: string): Promise<NutritionistPlanDTO> {
    console.log("getPlanBySlug called", slug);

    const plan =
      await this._nutritionistPlanBrowsingRepository.findBySlug(slug);

    if (!plan) {
      logger.warn(`Plan not found. Slug: ${slug}`);

      throw new CustomError("Plan not found.", StatusCode.NOT_FOUND);
    }

    logger.debug(`Retrieved plan "${slug}"`);

    return toNutritionistPlanDTO(plan);
  }
}
