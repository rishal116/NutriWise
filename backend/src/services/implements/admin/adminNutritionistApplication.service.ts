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

    const result = await this._applicationRepository.getApplications(query);

    return new InfiniteScrollResponseDTO(
      result.items,
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

    await this._applicationRepository.updateApplicationStatus(
      userId,
      status,
      rejectionReason,
    );

    if (status === "approved") {
      await this._userRepository.addRole(userId, UserRole.NUTRITIONIST);

      await this._notificationRepository.create({
        recipientId: new Types.ObjectId(userId),

        type: NotificationType.SUCCESS,

        title: "Application Approved",

        message:
          "Congratulations! Your nutritionist application has been approved.",
      });
    }

    if (status === "rejected") {
      await this._notificationRepository.create({
        recipientId: new Types.ObjectId(userId),

        type: NotificationType.WARNING,

        title: "Application Rejected",

        message:
          rejectionReason ??
          "Your nutritionist application has been rejected. Please review your application and apply again.",

        data: rejectionReason
          ? {
              rejectionReason,
            }
          : undefined,
      });
    }
  }
}
