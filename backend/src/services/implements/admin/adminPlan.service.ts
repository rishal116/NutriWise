import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IAdminPlanService } from "../../interfaces/admin/IAdminPlanService";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { PlanDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { toPlanDTO } from "../../../mapper/nutritionist/nutritionistPlan.mapper";
import logger from "../../../utils/logger";

@injectable()
export class AdminPlanService implements IAdminPlanService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private _planRepository: INutritionistPlanRepository
  ) {}
  
  async getAllPlans(): Promise<PlanDTO[]> {
    logger.info("Admin fetching all plans");
    const plans = await this._planRepository.findMany({});
    return plans.map(toPlanDTO);
  }
  
  async publishPlan(planId: string): Promise<PlanDTO> {
    logger.info(`Admin publishing plan ${planId}`);
    const plan = await this._planRepository.findById(planId);
    if (!plan) {
        logger.warn(`Plan not found: ${planId}`);
        throw new Error("Plan not found");
    }
    if (plan.status === "published") {
        logger.warn(`Plan already published: ${planId}`);
        throw new Error("Plan is already published");
    }
    const updatedPlan = await this._planRepository.updateById(planId, {
        status: "published",
    });
    logger.info(`Plan published successfully: ${planId}`);
    return toPlanDTO(updatedPlan);
    }
}
