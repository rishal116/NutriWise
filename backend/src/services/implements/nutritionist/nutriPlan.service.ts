import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistPlanService } from "../../interfaces/nutritionist/INutriPlanService";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutriProfileRepository";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import {
  toNutritionistPlanModel,
  toNutritionistPlanUpdateModel,
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
import { NutritionistPlanListItemDTO } from "../../../dtos/nutritionist/plan/nutritionist-plan-list-item.dto";
import { INutritionistPlanDayRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanDayRepository";
import { toPlanDTO } from "../../../mappers/nutritionist/plan/nutritionist-plan-details.mapper";
import { Types } from "mongoose";
import { UpdatePlanStatusDTO } from "../../../dtos/nutritionist/plan/update-plan-status.dto";
import { toNutritionistPlanListItemDTO } from "../../../mappers/nutritionist/plan/nutritionist-plan-list.mapper";

@injectable()
export class NutritionistPlanService implements INutritionistPlanService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private _nutritionistPlanRepository: INutritionistPlanRepository,

    @inject(TYPES.INutriPlanDayRepository)
    private _nutritionistPlanDayRepository: INutritionistPlanDayRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}

  async createPlan(nutritionistId: string, dto: CreatePlanDTO): Promise<void> {
    logger.info(`Creating plan for nutritionist ${nutritionistId}`);
    const validatedDto = await validateDto(CreatePlanDTO, dto);
    const slug = await generateUniquePlanSlug(
      this._nutritionistPlanRepository,
      nutritionistId,
      validatedDto.title,
    );
    const plan = toNutritionistPlanModel(nutritionistId, validatedDto, slug);
    const createdPlan = await this._nutritionistPlanRepository.create(plan);
    if (!createdPlan) {
      throw new CustomError(
        "Failed to create plan",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    logger.info(`Plan ${createdPlan._id.toString()} created successfully`);
  }

  async updatePlan(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanDTO,
  ): Promise<void> {
    logger.info(`Updating plan ${planId} for nutritionist ${nutritionistId}`);
    const validatedDto = await validateDto(UpdatePlanDTO, dto);
    const plan = await this._nutritionistPlanRepository.findDetailsById(
      planId,
      nutritionistId,
    );
    if (!plan) {
      logger.warn(
        `Plan ${planId} not found for nutritionist ${nutritionistId}`,
      );
      throw new CustomError("Plan not found", StatusCode.NOT_FOUND);
    }
    const updatePayload = toNutritionistPlanUpdateModel(validatedDto);
    if (Object.keys(updatePayload).length === 0) {
      throw new CustomError(
        "At least one field is required to update the plan",
        StatusCode.BAD_REQUEST,
      );
    }
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
  }

  async getNutritionistPlans(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanListItemDTO>> {
    logger.info(`Fetching plans for nutritionist ${nutritionistId}`);
    const validatedQuery = await validateDto(GetPlansDTO, query);
    const result = await this._nutritionistPlanRepository.findByNutritionistId(
      nutritionistId,
      validatedQuery,
    );
    const planIds = result.items.map((plan) => plan._id);
    const configuredDaysByPlanId =
      planIds.length > 0
        ? await this._nutritionistPlanDayRepository.countDaysByPlanIds(planIds)
        : new Map<string, number>();
    const planItems = result.items.map((plan) =>
      toNutritionistPlanListItemDTO(
        plan,
        configuredDaysByPlanId.get(plan._id.toString()) ?? 0,
      ),
    );
    logger.info(
      `Fetched ${planItems.length} plans for nutritionist ${nutritionistId}`,
    );
    return new InfiniteScrollResponseDTO(
      planItems,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO> {
    logger.info(`Fetching plan ${planId} for nutritionist ${nutritionistId}`);
    const plan = await this._nutritionistPlanRepository.findDetailsById(
      planId,
      nutritionistId,
    );
    if (!plan) {
      logger.warn(
        `Plan ${planId} not found for nutritionist ${nutritionistId}`,
      );
      throw new CustomError("Plan not found", StatusCode.NOT_FOUND);
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

  async updatePlanStatus(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanStatusDTO,
  ): Promise<void> {
    logger.info(`Updating status of plan ${planId}`);

    const validatedDto = await validateDto(UpdatePlanStatusDTO, dto);

    const plan = await this._nutritionistPlanRepository.findDetailsById(
      planId,
      nutritionistId,
    );

    if (!plan) {
      throw new CustomError("Plan not found", StatusCode.NOT_FOUND);
    }

    if (plan.status === validatedDto.status) {
      throw new CustomError(
        `Plan is already ${validatedDto.status}`,
        StatusCode.CONFLICT,
      );
    }

    if (plan.status === "archived") {
      throw new CustomError(
        "Archived plans cannot change status",
        StatusCode.BAD_REQUEST,
      );
    }

    if (validatedDto.status === "published") {
      const configuredDaysByPlanId =
        await this._nutritionistPlanDayRepository.countDaysByPlanIds([
          plan._id,
        ]);

      const configuredDays =
        configuredDaysByPlanId.get(plan._id.toString()) ?? 0;

      if (configuredDays < plan.durationDays) {
        throw new CustomError(
          `You must create all ${plan.durationDays} plan days before publishing. Currently, ${configuredDays} days are configured.`,
          StatusCode.BAD_REQUEST,
        );
      }

      const publishedCount =
        await this._nutritionistPlanRepository.countDocuments({
          nutritionistId: new Types.ObjectId(nutritionistId),
          status: "published",
        });

      if (publishedCount >= MAX_PUBLISHED_PLANS) {
        throw new CustomError(
          `You can publish only ${MAX_PUBLISHED_PLANS} plans.`,
          StatusCode.CONFLICT,
        );
      }
    }

    const updatedPlan = await this._nutritionistPlanRepository.updateById(
      planId,
      { status: validatedDto.status },
    );

    if (!updatedPlan) {
      throw new CustomError(
        "Failed to update plan status",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info(`Plan ${planId} status changed to ${validatedDto.status}`);
  }
}
