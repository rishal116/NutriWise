import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { CoachLevel } from "../../../types/nutritionist.types";
import { NutritionistMapper } from "../../../mapper/admin/nutritionist/nutritionist.mapper";
import { Types } from "mongoose";
import { NotificationType } from "../../../models/notification.model";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";

@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminNutritionistRepository)
    private _nutritionistRepository: IAdminNutritionistRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}

  async getNutritionists(query: AdminNutritionistListQueryDto): Promise<{
    data: AdminNutritionistListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }> {
    logger.info("Fetching nutritionists", query);
    const { nutritionists, total } =
      await this._nutritionistRepository.getNutritionists(query);

    const data =
      NutritionistMapper.toAdminNutritionistListItemDtos(nutritionists);
    return {
      data,
      total,
      skip: query.skip,
      limit: query.limit,
      hasMore: query.skip + data.length < total,
    };
  }

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null> {
    logger.info("Fetching nutritionist details", { userId });
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
    logger.info("Updating coach level", {
      userId,
      coachLevel,
    });

    await this._nutritionistRepository.updateCoachLevel(userId, coachLevel);

    await this._notificationRepository.create({
      recipientId: new Types.ObjectId(userId),
      type: NotificationType.SUCCESS,
      title: "Coach Level Updated",
      message: `Your coach level has been updated to ${coachLevel.replace("_", " ")}.`,
      data: {
        coachLevel,
      },
    });
  }
}
