import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import { IAdminUserRepository } from "../../../repositories/interfaces/admin/IAdminUserRepository";
import { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import {
  AdminNutritionistProfileDTO,
  NutritionistStatusDTO,
} from "../../../dtos/admin/user.dto";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";

@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminUserRepository)
    private _adminUserRepository: IAdminUserRepository,

    @inject(TYPES.IAdminNutritionistRepository)
    private _adminNutritionistRepository: IAdminNutritionistRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}

  async getAllNutritionists(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    logger.info("Fetching all nutritionists", {
      page,
      limit,
      search,
    });

    const { nutritionists, total } =
      await this._adminUserRepository.getAllNutritionists(skip, limit, search);

    logger.info("Fetched nutritionists successfully", {
      count: nutritionists.length,
      total,
    });

    return new PaginatedResponseDto(
      nutritionists.map((n) => new NutritionistStatusDTO(n)),
      total,
      page,
      limit,
    );
  }

  async getNutritionistApplications(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResponseDto<NutritionistStatusDTO>> {
    const skip = (page - 1) * limit;

    logger.info("Fetching nutritionist applications", {
      page,
      limit,
      search,
    });

    const { nutritionists, total } =
      await this._adminNutritionistRepository.getNutritionistApplications(
        skip,
        limit,
        search,
      );

    logger.info("Fetched applications successfully", {
      count: nutritionists.length,
      total,
    });

    return new PaginatedResponseDto(
      nutritionists.map((n) => new NutritionistStatusDTO(n)),
      total,
      page,
      limit,
    );
  }

  async getNutritionistById(userId: string) {
    logger.info("Fetching nutritionist by ID", { userId });

    const data = await this._adminNutritionistRepository.findByUserId(userId);

    if (!data) {
      logger.warn("Nutritionist not found", { userId });
    }

    return data;
  }

  async approveNutritionist(userId: string): Promise<void> {
    logger.info("Approving nutritionist", { userId });

    const user = await this._adminUserRepository.updateById(userId, {
      roles: ["client", "nutritionist"],
    });

    if (!user) {
      logger.error("Approval failed - user not found", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    const profile =
      await this._adminNutritionistRepository.updateVerificationStatus(
        userId,
        "approved",
        "",
      );

    if (!profile) {
      logger.error("Approval failed - nutritionist profile not found", {
        userId,
      });
      throw new CustomError(
        "Nutritionist profile not found",
        StatusCode.NOT_FOUND,
      );
    }

    logger.info("Nutritionist approved successfully", {
      userId,
      status: "approved",
    });

    await this._notificationRepository.createNotification({
      title: "Approved",
      message: "Your nutritionist profile is approved",
      type: "success",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    });

    logger.info("Approval notification sent", { userId });
  }

  async rejectNutritionist(userId: string, reason: string): Promise<void> {
    logger.info("Rejecting nutritionist", { userId, reason });

    const profile =
      await this._adminNutritionistRepository.updateVerificationStatus(
        userId,
        "rejected",
        reason,
      );

    if (!profile) {
      logger.error("Rejection failed - nutritionist profile not found", {
        userId,
      });
      throw new CustomError(
        "Nutritionist profile not found",
        StatusCode.NOT_FOUND,
      );
    }

    logger.info("Nutritionist rejected", { userId, reason });

    await this._notificationRepository.createNotification({
      title: "Rejected",
      message: reason,
      type: "error",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    });

    logger.info("Rejection notification sent", { userId });
  }
  async getNutritionistProfile(userId: string) {
    logger.info("Fetching nutritionist profile", { userId });

    const user = await this._adminUserRepository.findById(userId);

    if (!user) {
      logger.error("User not found while fetching profile", { userId });
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    const profile =
      await this._adminNutritionistRepository.findByUserId(userId);

    if (!profile) {
      logger.warn("Nutritionist profile missing", { userId });
      throw new CustomError("Profile not found", StatusCode.NOT_FOUND);
    }

    logger.info("Nutritionist profile fetched successfully", { userId });

    return new AdminNutritionistProfileDTO(user, profile);
  }

  async updateNutritionistLevel(
    nutritionistId: string,
    level: NutritionistLevel,
  ) {
    logger.info("Updating nutritionist level", {
      nutritionistId,
      level,
    });

    const profile =
      await this._adminNutritionistRepository.updateNutritionistLevel(
        nutritionistId,
        level,
      );

    if (!profile) {
      logger.error("Level update failed - profile not found", {
        nutritionistId,
        level,
      });

      throw new CustomError("Profile not found", StatusCode.NOT_FOUND);
    }

    logger.info("Nutritionist level updated successfully", {
      nutritionistId,
      level,
    });
  }
}
