import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { NotificationType } from "../../../models/notification.model";
import type { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import type { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import type { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import type { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import type { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutritionistMapper } from "../../../mappers/admin/nutritionist/nutritionist.mapper";
import {
  COACH_LEVELS,
  type CoachLevel,
} from "../../../types/nutritionist.types";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminNutritionistRepository)
    private readonly _nutritionistRepository: IAdminNutritionistRepository,

    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>> {
    logger.info("Fetching nutritionists", { query });

    const validatedDto = await validateDto(
      AdminNutritionistListQueryDto,
      query,
    );

    const result =
      await this._nutritionistRepository.getNutritionists(validatedDto);

    const items = NutritionistMapper.toAdminNutritionistListItemDtos(
      result.items,
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto> {
    logger.info("Fetching nutritionist details", { userId });

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid nutritionist ID", StatusCode.BAD_REQUEST);
    }

    const nutritionist =
      await this._nutritionistRepository.getNutritionistDetails(userId);

    if (!nutritionist) {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }

    return NutritionistMapper.toAdminNutritionistDetailsDto(nutritionist);
  }

  async updateCoachLevel(
    userId: string,
    coachLevel: CoachLevel,
  ): Promise<void> {
    logger.info("Updating nutritionist coach level", {
      userId,
      coachLevel,
    });

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid nutritionist ID", StatusCode.BAD_REQUEST);
    }

    if (!COACH_LEVELS.includes(coachLevel)) {
      throw new CustomError("Invalid coach level", StatusCode.BAD_REQUEST);
    }

    const nutritionist =
      await this._nutritionistRepository.getNutritionistDetails(userId);

    if (!nutritionist) {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }

    await this._nutritionistRepository.updateCoachLevel(userId, coachLevel);

    await this._notificationRepository.create({
      recipientId: new Types.ObjectId(userId),
      type: NotificationType.SUCCESS,
      title: "Coach Level Updated",
      message: `Your coach level has been updated to ${coachLevel.replace(/_/g, " ")}.`,
      data: { coachLevel },
    });
  }
}
