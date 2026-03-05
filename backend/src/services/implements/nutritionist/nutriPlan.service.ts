import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistPlanService } from "../../interfaces/nutritionist/INutritionistPlanService";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { IPlan } from "../../../models/nutritionistPlan.model";
import { UpdatePlanDTO, CreatePlanDTO, PlanDTO, NutritionistPricingDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { Types } from "mongoose";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { GetAllowedPlanCategoriesDTO} from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { toPlanDTO, toNutritionistPricingDTO } from "../../../mapper/nutritionist/nutritionistPlan.mapper";
import logger from "../../../utils/logger";
import { PRICING_RULES } from "../../../constants/nutritionist/nutritionistPlan.constant";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { mapSpecializationsToCategories } from "../../../mapper/nutritionist/specializationCategory.mapper";
import { NutritionistSpecialization } from "../../../constants";

@injectable()
export class NutritionistPlanService implements INutritionistPlanService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private _nutritionistPlanRepository: INutritionistPlanRepository,
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository
  ) {}

  async createPlan(nutritionistId: string, dto: CreatePlanDTO): Promise<{ message: string }> {
    logger.info(`Creating plan for nutritionist ${nutritionistId}`);
    const MAX_PUBLISHED_PLANS = 3;

    if (dto.status === "published") {
      const publishedCount = await this._nutritionistPlanRepository.count({
        nutritionistId: new Types.ObjectId(nutritionistId),
        status: "published",
      });

      if (publishedCount >= MAX_PUBLISHED_PLANS) {
        throw new CustomError(
          `Plan limit reached. You can publish only ${MAX_PUBLISHED_PLANS} plans.`,
          StatusCode.CONFLICT
        );
      }
    }

    const planData: Partial<IPlan> = {
      nutritionistId: new Types.ObjectId(nutritionistId),
      title: dto.title,
      category: dto.category,
      durationInDays: dto.durationInDays,
      price: dto.price,
      description: dto.description,
      features: dto.features || [],
      status: dto.status ?? "draft",
    };

    try {
      await this._nutritionistPlanRepository.create(planData);
      logger.info(`Plan created successfully`);
      return { message: "Plan created successfully" };
    } catch (err) {
      logger.error("Failed to create plan", err);
      throw new CustomError("Failed to create plan", StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePlan(nutritionistId: string, planId: string, data: UpdatePlanDTO): Promise<IPlan> {
    logger.info(`Updating plan ${planId} for nutritionist ${nutritionistId}`);
    const MAX_PUBLISHED_PLANS = 3;
    if (data.status === "published") {
      const publishedCount = await this._nutritionistPlanRepository.count({
        nutritionistId: new Types.ObjectId(nutritionistId),
        status: "published",
      });
      if (publishedCount >= MAX_PUBLISHED_PLANS) {
        throw new CustomError(
          `Plan limit reached. You can publish only ${MAX_PUBLISHED_PLANS} plans.`,
          StatusCode.CONFLICT
        );
      }
    }
    const plan = await this._nutritionistPlanRepository.findById(planId);

    if (!plan || plan.nutritionistId.toString() !== nutritionistId) {
      logger.warn(`Unauthorized update attempt on plan ${planId} by nutritionist ${nutritionistId}`);
      throw new CustomError("Plan not found or unauthorized", StatusCode.NOT_FOUND);
    }

    try {
      const updatedPlan = await this._nutritionistPlanRepository.updateById(planId, data);
      logger.info(`Plan ${planId} updated successfully`);
      return updatedPlan;
    } catch (err) {
      logger.error("Failed to update plan", err);
      throw new CustomError("Failed to update plan", StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getPlansByNutritionist(nutritionistId: string): Promise<PlanDTO[]> {
    logger.info(`Fetching plans for nutritionist ${nutritionistId}`);
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

    try {
      const plans = await this._nutritionistPlanRepository.findMany({
        nutritionistId: nutritionistObjectId,
      });
      const planDTOs = plans.map(toPlanDTO);
      logger.info(`Fetched ${planDTOs.length} plans for nutritionist ${nutritionistId}`);
      return planDTOs;
    } catch (err) {
      logger.error("Failed to fetch plans", err);
      throw new CustomError("Failed to fetch plans", StatusCode.INTERNAL_SERVER_ERROR);
    }
  }
  
  async getAllowedPlanCategories(nutritionistId: string): Promise<GetAllowedPlanCategoriesDTO> {
    logger.info(`Fetching allowed categories for ${nutritionistId}`);
    const nutritionist = await this._nutritionistProfileRepository.findByUserId(
      nutritionistId
    );
    if (!nutritionist) {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }
    const specializations = nutritionist.specializations as NutritionistSpecialization[];
    console.log(specializations);
    
    const allowedCategories = mapSpecializationsToCategories(specializations);
    return allowedCategories;
  }

  async getNutritionistPricing(nutritionistId: string): Promise<NutritionistPricingDTO> {
    logger.info(`Fetching pricing rules for nutritionist ${nutritionistId}`);
    const profile = await this._nutritionistProfileRepository.findByUserId(nutritionistId);

    if (!profile) {
      logger.warn(`Nutritionist profile not found for ${nutritionistId}`);
      throw new CustomError("Nutritionist profile not found", StatusCode.NOT_FOUND);
    }

    const status = profile.coachLevel;
    const pricing = PRICING_RULES[status];

    if (!pricing) {
      logger.error(`Pricing rules not found for status ${status}`);
      throw new CustomError("Invalid nutritionist status", StatusCode.INTERNAL_SERVER_ERROR);
    }

    return toNutritionistPricingDTO(status, pricing.minPrice, pricing.maxPrice);
  }
  
  async getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO> {
    logger.info(`Fetching plan ${planId} for nutritionist ${nutritionistId}`);
    const plan = await this._nutritionistPlanRepository.findById(planId);
    if (!plan || plan.nutritionistId.toString() !== nutritionistId) {
      logger.warn(`Plan ${planId} not found or unauthorized access by ${nutritionistId}`);
      throw new CustomError("Plan not found or unauthorized", StatusCode.NOT_FOUND);
    }
    return toPlanDTO(plan);
  }

}
