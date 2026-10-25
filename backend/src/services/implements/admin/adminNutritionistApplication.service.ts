import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { IAdminNutritionistApplicationService } from "../../interfaces/admin/IAdminNutritionistApplicationService";
import { IAdminNutritionistApplicationRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistApplicationRepository";
import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import { ApplicationStatus } from "../../../types/nutritionist.types";
import { IAdminUserRepository } from "../../../repositories/interfaces/admin/IAdminUserRepository";
import { UserRole } from "../../../enums/user.enum";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { NotificationType } from "../../../models/notification.model";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminNutritionistApplicationMapper } from "../../../mappers/admin/nutri-application/admin-nutritionist-application.mapper";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class AdminNutritionistApplicationService implements IAdminNutritionistApplicationService {
  constructor(
    @inject(TYPES.IAdminNutritionistApplicationRepository)
    private readonly _applicationRepository: IAdminNutritionistApplicationRepository,

    @inject(TYPES.IAdminUserRepository)
    private readonly _userRepository: IAdminUserRepository,

    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    InfiniteScrollResponseDTO<AdminNutritionistApplicationListItemDto>
  > {
    logger.info("Fetching nutritionist applications", query);

    const validatedQuery = await validateDto(
      AdminNutritionistApplicationListQueryDto,
      query,
    );

    const result =
      await this._applicationRepository.getApplications(validatedQuery);

    const items = AdminNutritionistApplicationMapper.toListItemDtos(
      result.items,
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void> {
    logger.info("Updating nutritionist application status", {
      userId,
      status,
    });

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID.", StatusCode.BAD_REQUEST);
    }

    if (status !== "approved" && status !== "rejected") {
      throw new CustomError(
        "Only approval or rejection is allowed.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      throw new CustomError(
        "A rejection reason is required.",
        StatusCode.BAD_REQUEST,
      );
    }

    const updated = await this._applicationRepository.updateApplicationStatus(
      userId,
      status,
      rejectionReason,
    );

    if (!updated) {
      throw new CustomError(
        "Pending nutritionist application not found.",
        StatusCode.NOT_FOUND,
      );
    }

    if (status === "approved") {
      await this._userRepository.addRole(userId, UserRole.NUTRITIONIST);

      await this._notificationRepository.create({
        recipientId: new Types.ObjectId(userId),
        type: NotificationType.SUCCESS,
        title: "Application Approved",
        message:
          "Congratulations! Your nutritionist application has been approved.",
      });

      return;
    }

    await this._notificationRepository.create({
      recipientId: new Types.ObjectId(userId),
      type: NotificationType.WARNING,
      title: "Application Rejected",
      message: rejectionReason!.trim(),
      data: {
        rejectionReason: rejectionReason!.trim(),
      },
    });
  }
}
