import { inject, injectable } from "inversify";
import {
  IUserActivityTracking,
  UserActivityTrackingStatus,
  ActivityCompletedBy,
} from "../../../../models/userActivityTracking.model";
import { IUserActivityTrackingService } from "../../../interfaces/user/tracking/IUserActivityTrackingService";
import { IUserActivityTrackingRepository } from "../../../../repositories/interfaces/user/tracking/IUserActivityTrackingRepository";
import { CreateUserActivityTrackingDTO } from "../../../../dtos/user/tracking/create-user-activity-tracking.dto";
import { UpdateActivityTrackingDTO } from "../../../../dtos/user/tracking/update-activity-tracking.dto";
import { UserActivityTrackingResponseDTO } from "../../../../dtos/user/tracking/user-activity-tracking-response.dto";
import { CustomError } from "../../../../utils/customError";
import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { UserActivityTrackingMapper } from "../../../../mappers/user/tracking/user-activity-tracking.mapper";
import { Types } from "mongoose";

@injectable()
export class UserActivityTrackingService implements IUserActivityTrackingService {
  constructor(
    @inject(TYPES.IUserActivityTrackingRepository)
    private readonly _userActivityTrackingRepository: IUserActivityTrackingRepository,
  ) {}

  async initializeForDay(
    activities: CreateUserActivityTrackingDTO[],
  ): Promise<UserActivityTrackingResponseDTO[]> {
    if (activities.length === 0) {
      return [];
    }

    const trackingData = activities.map((activity) => ({
      userId: new Types.ObjectId(activity.userId),
      userProgramId: new Types.ObjectId(activity.userProgramId),
      userProgramDayId: new Types.ObjectId(activity.userProgramDayId),
      userDayTrackingId: new Types.ObjectId(activity.userDayTrackingId),
      activityId: new Types.ObjectId(activity.activityId),
      title: activity.title,
      category: activity.category,
      status: activity.status,
      valueType: activity.valueType,
      targetValue: activity.targetValue,
      unit: activity.unit,
      completedBy: activity.completedBy,
      lastUpdatedBy: activity.lastUpdatedBy,
      evidence: [],
    }));

    const tracking =
      await this._userActivityTrackingRepository.initializeForDay(trackingData);

    return UserActivityTrackingMapper.toDTOList(tracking);
  }

  async startActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO> {
    console.log("========== START ACTIVITY ==========");
    console.log("userId:", userId);
    console.log("userProgramId:", userProgramId);
    console.log("userProgramDayId:", userProgramDayId);
    console.log("activityId:", activityId);
    console.log("====================================");

    const existingTracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        userProgramDayId,
        activityId,
      );

    console.log("existingTracking:", existingTracking);

    if (!existingTracking) {
      console.log("❌ Activity tracking has NOT been initialized");
      throw new CustomError(
        "Activity tracking has not been initialized",
        StatusCode.NOT_FOUND,
      );
    }

    console.log("✅ Activity tracking found");
    console.log("tracking._id:", existingTracking._id.toString());
    console.log("tracking.userId:", existingTracking.userId.toString());
    console.log(
      "tracking.userProgramId:",
      existingTracking.userProgramId.toString(),
    );
    console.log(
      "tracking.userProgramDayId:",
      existingTracking.userProgramDayId.toString(),
    );
    console.log("tracking.activityId:", existingTracking.activityId.toString());
    console.log("tracking.status:", existingTracking.status);

    this.validateOwnership(
      existingTracking,
      userId,
      userProgramId,
      userProgramDayId,
    );

    console.log("✅ Ownership validation passed");

    this.validateActivityCanStart(existingTracking);

    console.log("✅ Activity can be started");

    const updatedTracking =
      await this._userActivityTrackingRepository.updateById(
        existingTracking._id,
        {
          status: UserActivityTrackingStatus.IN_PROGRESS,
          startedAt: existingTracking.startedAt ?? new Date(),
          lastUpdatedBy: ActivityCompletedBy.USER,
        },
      );

    console.log("updatedTracking:", updatedTracking);

    if (!updatedTracking) {
      console.log("❌ Failed to start activity");
      throw new CustomError(
        "Failed to start activity",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    console.log("✅ ACTIVITY STARTED SUCCESSFULLY");
    console.log("====================================");

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }

  async updateActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    data: UpdateActivityTrackingDTO,
  ): Promise<UserActivityTrackingResponseDTO> {
    console.log("========== UPDATE ACTIVITY ==========");
    console.log("userId:", userId);
    console.log("userProgramId:", userProgramId);
    console.log("userProgramDayId:", userProgramDayId);
    console.log("activityId:", activityId);
    console.log("data:", data);
    console.log("=====================================");

    const existingTracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        userProgramDayId,
        activityId,
      );

    if (!existingTracking) {
      throw new CustomError(
        "Activity tracking not found",
        StatusCode.NOT_FOUND,
      );
    }

    this.validateOwnership(
      existingTracking,
      userId,
      userProgramId,
      userProgramDayId,
    );

    this.validateActivityCanUpdate(existingTracking);

    const update: Partial<IUserActivityTracking> = {
      ...data,
      lastUpdatedBy: ActivityCompletedBy.USER,
    };

    if (data.status === UserActivityTrackingStatus.IN_PROGRESS) {
      update.startedAt = existingTracking.startedAt ?? new Date();
    }

    if (data.status === UserActivityTrackingStatus.COMPLETED) {
      update.startedAt = existingTracking.startedAt ?? new Date();
      update.completedAt = new Date();
      update.completedBy = ActivityCompletedBy.USER;
    }

    const updatedTracking =
      await this._userActivityTrackingRepository.updateById(
        existingTracking._id,
        update,
      );

    if (!updatedTracking) {
      throw new CustomError(
        "Failed to update activity tracking",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }

  async skipActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    skippedReason: string,
  ): Promise<UserActivityTrackingResponseDTO> {
    const existingTracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        userProgramDayId,
        activityId,
      );

    if (!existingTracking) {
      throw new CustomError(
        "Activity tracking not found",
        StatusCode.NOT_FOUND,
      );
    }

    this.validateOwnership(
      existingTracking,
      userId,
      userProgramId,
      userProgramDayId,
    );

    if (existingTracking.status === UserActivityTrackingStatus.COMPLETED) {
      throw new CustomError(
        "Completed activity cannot be skipped",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!skippedReason.trim()) {
      throw new CustomError(
        "Skipped reason is required",
        StatusCode.BAD_REQUEST,
      );
    }

    const updatedTracking =
      await this._userActivityTrackingRepository.updateById(
        existingTracking._id,
        {
          status: UserActivityTrackingStatus.SKIPPED,
          skippedReason: skippedReason.trim(),
          completedBy: ActivityCompletedBy.USER,
          lastUpdatedBy: ActivityCompletedBy.USER,
        },
      );

    if (!updatedTracking) {
      throw new CustomError(
        "Failed to skip activity",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }

  async getActivityTracking(
    userId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO | null> {
    const tracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        userProgramDayId,
        activityId,
      );

    if (!tracking) {
      return null;
    }

    if (
      tracking.userId.toString() !== userId ||
      tracking.userProgramDayId.toString() !== userProgramDayId
    ) {
      throw new CustomError(
        "You are not authorized to access this activity",
        StatusCode.UNAUTHORIZED,
      );
    }

    return UserActivityTrackingMapper.toDTO(tracking);
  }

  async getDayActivityTracking(
    userId: string,
    userDayTrackingId: string,
  ): Promise<UserActivityTrackingResponseDTO[]> {
    const tracking =
      await this._userActivityTrackingRepository.findByDayTracking(
        userDayTrackingId,
      );

    const userTracking = tracking.filter(
      (activity) => activity.userId.toString() === userId,
    );

    return UserActivityTrackingMapper.toDTOList(userTracking);
  }

  private validateOwnership(
    tracking: IUserActivityTracking,
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
  ): void {
    if (
      tracking.userId.toString() !== userId ||
      tracking.userProgramId.toString() !== userProgramId ||
      tracking.userProgramDayId.toString() !== userProgramDayId
    ) {
      throw new CustomError(
        "You are not authorized to access this activity",
        StatusCode.UNAUTHORIZED,
      );
    }
  }

  private validateActivityCanStart(tracking: IUserActivityTracking): void {
    if (
      tracking.status === UserActivityTrackingStatus.COMPLETED ||
      tracking.status === UserActivityTrackingStatus.SKIPPED
    ) {
      throw new CustomError(
        `Activity is already ${tracking.status}`,
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validateActivityCanUpdate(tracking: IUserActivityTracking): void {
    if (tracking.status === UserActivityTrackingStatus.SKIPPED) {
      throw new CustomError(
        "Skipped activity cannot be updated",
        StatusCode.BAD_REQUEST,
      );
    }

    if (tracking.status === UserActivityTrackingStatus.COMPLETED) {
      throw new CustomError(
        "Completed activity cannot be updated",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
