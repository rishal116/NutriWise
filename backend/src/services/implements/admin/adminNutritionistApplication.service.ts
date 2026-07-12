import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { Types } from "mongoose";
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

@injectable()
export class AdminNutritionistApplicationService implements IAdminNutritionistApplicationService {
  constructor(
    @inject(TYPES.IAdminNutritionistApplicationRepository)
    private _applicationRepository: IAdminNutritionistApplicationRepository,

    @inject(TYPES.IAdminUserRepository)
    private _userRepository: IAdminUserRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}

  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<{
    data: AdminNutritionistApplicationListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }> {
    logger.info("Fetching nutritionist applications", query);
    const { applications, total } =
      await this._applicationRepository.getApplications(query);
    return {
      data: applications,
      total,
      skip: query.skip,
      limit: query.limit,
      hasMore: query.skip + applications.length < total,
    };
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
