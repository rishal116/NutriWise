import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import {
  CreateNutritionistPlanDayDTO,
  UpdateNutritionistPlanDayDTO,
} from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";

import { NutritionistPlanDayListQueryDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

import type { NutritionistPlanDayListItemDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

import type { NutritionistPlanDayDetailsDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

import type { INutritionistPlanDayRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanDayRepository";

import type { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutriPlanRepository";

import type { INutritionistPlanDayService } from "../../interfaces/nutritionist/INutriPlanDayService";

import { NutritionistPlanDayListItemMapper } from "../../../mappers/nutritionist/plan-day/nutritionist-plan-day-list-item.mapper";

import { NutritionistPlanDayDetailsMapper } from "../../../mappers/nutritionist/plan-day/nutritionist-plan-day-details.mapper";

import { validateDto } from "../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../utils/customError";
import logger from "../../../utils/logger";

@injectable()
export class NutritionistPlanDayService implements INutritionistPlanDayService {
  constructor(
    @inject(TYPES.INutriPlanDayRepository)
    private readonly _nutritionistPlanDayRepository: INutritionistPlanDayRepository,

    @inject(TYPES.INutritionistPlanRepository)
    private readonly _nutritionistPlanRepository: INutritionistPlanRepository,
  ) {}

  async browsePlanDays(
    nutritionistId: string,
    planId: string,
    query: NutritionistPlanDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanDayListItemDTO>> {
    logger.debug(
      `Fetching nutritionist plan days. nutritionistId=${nutritionistId}, planId=${planId}`,
    );

    const validatedQuery = await validateDto(
      NutritionistPlanDayListQueryDTO,
      query,
    );

    const exists = await this._nutritionistPlanRepository.exists({
      _id: new Types.ObjectId(planId),
      nutritionistId: new Types.ObjectId(nutritionistId),
    });

    if (!exists) {
      throw new CustomError(
        "Nutritionist plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    const result = await this._nutritionistPlanDayRepository.browsePlanDays(
      nutritionistId,
      planId,
      validatedQuery,
    );

    logger.info(
      `Fetched ${result.items.length} nutritionist plan days. nutritionistId=${nutritionistId}, planId=${planId}`,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((item) => NutritionistPlanDayListItemMapper.toDTO(item)),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPlanDayDetails(
    nutritionistId: string,
    planId: string,
    dayNumber: number,
  ): Promise<NutritionistPlanDayDetailsDTO> {
    logger.debug(
      `Fetching nutritionist plan day details. nutritionistId=${nutritionistId}, planId=${planId}, dayNumber=${dayNumber}`,
    );

    const day = await this._nutritionistPlanDayRepository.findPlanDayDetails(
      nutritionistId,
      planId,
      dayNumber,
    );

    if (!day) {
      throw new CustomError("Plan day not found", StatusCode.NOT_FOUND);
    }

    logger.info(
      `Successfully fetched nutritionist plan day details. planId=${planId}, dayNumber=${dayNumber}`,
    );

    return NutritionistPlanDayDetailsMapper.toDTO(day);
  }

  async createPlanDay(
    nutritionistId: string,
    planId: string,
    dto: CreateNutritionistPlanDayDTO,
  ): Promise<void> {
    const validatedDTO = await validateDto(CreateNutritionistPlanDayDTO, dto);

    logger.debug(
      `Creating nutritionist plan day. nutritionistId=${nutritionistId}, planId=${planId}`,
    );

    const plan = await this._nutritionistPlanRepository.findOne({
      _id: new Types.ObjectId(planId),
      nutritionistId: new Types.ObjectId(nutritionistId),
    });

    if (!plan) {
      throw new CustomError(
        "Nutritionist plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (validatedDTO.dayNumber > plan.durationDays) {
      throw new CustomError(
        `Day number cannot exceed the plan duration of ${plan.durationDays} days`,
        StatusCode.BAD_REQUEST,
      );
    }

    const existingDay = await this._nutritionistPlanDayRepository.exists({
      planId: new Types.ObjectId(planId),
      dayNumber: validatedDTO.dayNumber,
    });

    if (existingDay) {
      throw new CustomError(
        `Day ${validatedDTO.dayNumber} already exists in this plan`,
        StatusCode.CONFLICT,
      );
    }

    await this._nutritionistPlanDayRepository.create({
      ...validatedDTO,
      planId: new Types.ObjectId(planId),
      activities: validatedDTO.activities.map((activity) => ({
        ...activity,
        _id: new Types.ObjectId(),
      })),
    });

    logger.info(
      `Successfully created nutritionist plan day. planId=${planId}, dayNumber=${validatedDTO.dayNumber}`,
    );
  }

  async updatePlanDay(
    nutritionistId: string,
    planId: string,
    dayNumber: number,
    dto: UpdateNutritionistPlanDayDTO,
  ): Promise<void> {
    const validatedDTO = await validateDto(UpdateNutritionistPlanDayDTO, dto);

    logger.debug(
      `Updating nutritionist plan day. nutritionistId=${nutritionistId}, planId=${planId}, dayNumber=${dayNumber}`,
    );

    const exists = await this._nutritionistPlanRepository.exists({
      _id: new Types.ObjectId(planId),
      nutritionistId: new Types.ObjectId(nutritionistId),
    });

    if (!exists) {
      throw new CustomError(
        "Nutritionist plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    const updatedCount = await this._nutritionistPlanDayRepository.updateOne(
      {
        planId: new Types.ObjectId(planId),
        dayNumber,
      },
      {
        $set: validatedDTO,
      },
    );

    if (updatedCount === 0) {
      throw new CustomError("Plan day not found", StatusCode.NOT_FOUND);
    }

    logger.info(
      `Successfully updated nutritionist plan day. planId=${planId}, dayNumber=${dayNumber}`,
    );
  }
}
