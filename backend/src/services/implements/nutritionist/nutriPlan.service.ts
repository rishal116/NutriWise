import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistPlanService } from "../../interfaces/nutritionist/INutriPlanService";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { Types } from "mongoose";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutriProfileRepository";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import {
  toNutritionistPlanModel,
  toNutritionistPlanUpdateModel,
  toPlanDTO,
} from "../../../mappers/nutritionist/plan/nutritionist-plan.mapper";
import { CreatePlanDTO } from "../../../dtos/nutritionist/plan/create-plan.dto";
import { PlanDTO } from "../../../dtos/nutritionist/plan/plan.dto";
import { UpdatePlanDTO } from "../../../dtos/nutritionist/plan/update-plan.dto";
import { MAX_PUBLISHED_PLANS } from "../../../constants/nutritionist/plan/nutritionist-plan.constant";
import { toPlanMetadataDTO } from "../../../mappers/nutritionist/plan/plan-metadata.dto";
import { PlanMetadataDTO } from "../../../dtos/nutritionist/plan/plan-metadata.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import { generateUniquePlanSlug } from "../../../utils/plan-slug.util";

@injectable()
export class NutritionistPlanService implements INutritionistPlanService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private _nutritionistPlanRepository: INutritionistPlanRepository,
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}

  async createPlan(
    nutritionistId: string,
    dto: CreatePlanDTO,
  ): Promise<PlanDTO> {
    logger.info(`Creating plan for nutritionist ${nutritionistId}`);
    await validateDto(CreatePlanDTO, dto);
    if (dto.status === "published") {
      const publishedCount = await this._nutritionistPlanRepository.count({
        nutritionistId: new Types.ObjectId(nutritionistId),
        status: "published",
        isDeleted: false,
      });
      if (publishedCount >= MAX_PUBLISHED_PLANS) {
        throw new CustomError(
          `Plan limit reached. You can publish only ${MAX_PUBLISHED_PLANS} plans.`,
          StatusCode.CONFLICT,
        );
      }
    }
    const slug = await generateUniquePlanSlug(
      this._nutritionistPlanRepository,
      nutritionistId,
      dto.title,
    );
    const plan = toNutritionistPlanModel(nutritionistId, dto, slug);
    const createdPlan = await this._nutritionistPlanRepository.create(plan);
    logger.info(`Plan ${createdPlan._id.toString()} created successfully`);
    return toPlanDTO(createdPlan);
  }
  async updatePlan(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanDTO,
  ): Promise<PlanDTO> {
    logger.info(`Updating plan ${planId} for nutritionist ${nutritionistId}`);
    await validateDto(UpdatePlanDTO, dto);
    const plan = await this._nutritionistPlanRepository.findById(planId);
    if (!plan || plan.nutritionistId.toString() !== nutritionistId) {
      logger.warn(`Unauthorized update attempt on plan ${planId}`);
      throw new CustomError(
        "Plan not found or unauthorized",
        StatusCode.NOT_FOUND,
      );
    }
    if (dto.status === "published" && plan.status !== "published") {
      const publishedCount = await this._nutritionistPlanRepository.count({
        nutritionistId: new Types.ObjectId(nutritionistId),
        status: "published",
        isDeleted: false,
      });
      if (publishedCount >= MAX_PUBLISHED_PLANS) {
        throw new CustomError(
          `Plan limit reached. You can publish only ${MAX_PUBLISHED_PLANS} plans.`,
          StatusCode.CONFLICT,
        );
      }
    }
    const updatePayload = toNutritionistPlanUpdateModel(dto);
    const updatedPlan = await this._nutritionistPlanRepository.updateById(
      planId,
      updatePayload,
    );
    if (!updatedPlan) {
      throw new CustomError(
        "Failed to update plan",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    logger.info(`Plan ${planId} updated successfully`);
    return toPlanDTO(updatedPlan);
  }

  async getPlansByNutritionist(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<InfiniteScrollResponseDTO<PlanDTO>> {
    logger.info(`Fetching plans for nutritionist ${nutritionistId}`);

    const result = await this._nutritionistPlanRepository.findByNutritionistId(
      nutritionistId,
      query,
    );

    logger.info(
      `Fetched ${result.items.length} plans for nutritionist ${nutritionistId}`,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(toPlanDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO> {
    logger.info(`Fetching plan ${planId} for nutritionist ${nutritionistId}`);
    const plan = await this._nutritionistPlanRepository.findById(planId);
    if (!plan || plan.nutritionistId.toString() !== nutritionistId) {
      logger.warn(
        `Plan ${planId} not found or unauthorized access by ${nutritionistId}`,
      );
      throw new CustomError(
        "Plan not found or unauthorized",
        StatusCode.NOT_FOUND,
      );
    }
    return toPlanDTO(plan);
  }

  async getPlanMetadata(nutritionistId: string): Promise<PlanMetadataDTO> {
    logger.info(`Fetching plan metadata for nutritionist ${nutritionistId}`);

    const profile =
      await this._nutritionistProfileRepository.findByUserId(nutritionistId);

    if (!profile) {
      throw new CustomError(
        "Nutritionist profile not found",
        StatusCode.NOT_FOUND,
      );
    }

    return toPlanMetadataDTO(profile);
  }
}
