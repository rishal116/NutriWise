import { inject, injectable } from "inversify";
import { Types } from "mongoose";
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
import { IUserDayTrackingRepository } from "../../../../repositories/interfaces/user/tracking/IUserDayTrackingRepository";
import { IUserDayTracking, UserDayTrackingStatus } from "../../../../models/userDayTracking.model";

@injectable()
export class UserActivityTrackingService implements IUserActivityTrackingService {
  constructor(
    @inject(TYPES.IUserActivityTrackingRepository)
    private readonly _userActivityTrackingRepository: IUserActivityTrackingRepository,

    @inject(TYPES.IUserDayTrackingRepository)
    private readonly _userDayTrackingRepository: IUserDayTrackingRepository,
  ) { }

  private async findOwnedActivityTracking(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<IUserActivityTracking> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userProgramId, "User program ID");
    this.validateObjectId(userProgramDayId, "Program day ID");
    this.validateObjectId(activityId, "Activity ID");

    const dayTracking =
      await this._userDayTrackingRepository.findByProgramAndProgramDay(
        userProgramId,
        userProgramDayId,
      );

    if (!dayTracking) {
      throw new CustomError("Day tracking not found", StatusCode.NOT_FOUND);
    }

    if (dayTracking.userId.toString() !== userId) {
      throw new CustomError(
        "You are not authorized to access this activity",
        StatusCode.FORBIDDEN,
      );
    }

    const activityTracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        dayTracking._id,
        activityId,
      );

    if (!activityTracking) {
      throw new CustomError(
        "Activity tracking has not been initialized",
        StatusCode.NOT_FOUND,
      );
    }

    this.validateOwnership(
      activityTracking,
      userId,
      userProgramId,
      userProgramDayId,
    );

    return activityTracking;
  }

  async initializeForDay(
    activities: CreateUserActivityTrackingDTO[],
  ): Promise<UserActivityTrackingResponseDTO[]> {
    if (activities.length === 0) {
      return [];
    }

    const firstActivity = activities[0];

    this.validateObjectId(firstActivity.userId, "User ID");
    this.validateObjectId(firstActivity.userProgramId, "User program ID");
    this.validateObjectId(firstActivity.userProgramDayId, "Program day ID");
    this.validateObjectId(firstActivity.userDayTrackingId, "Day tracking ID");

    for (const activity of activities) {
      this.validateObjectId(activity.userId, "User ID");
      this.validateObjectId(activity.userProgramId, "User program ID");
      this.validateObjectId(activity.userProgramDayId, "Program day ID");
      this.validateObjectId(activity.userDayTrackingId, "Day tracking ID");
      this.validateObjectId(activity.activityId, "Activity ID");

      if (
        activity.userId !== firstActivity.userId ||
        activity.userProgramId !== firstActivity.userProgramId ||
        activity.userProgramDayId !== firstActivity.userProgramDayId ||
        activity.userDayTrackingId !== firstActivity.userDayTrackingId
      ) {
        throw new CustomError(
          "All activities must belong to the same user program day",
          StatusCode.BAD_REQUEST,
        );
      }
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
      ...(activity.unit !== undefined && { unit: activity.unit }),
      lastUpdatedBy: activity.lastUpdatedBy,
      evidence: [],
    }));

    console.log("[ActivityTracking] Initialization requested", {
      count: trackingData.length,
      userProgramDayId: firstActivity.userProgramDayId,
      userDayTrackingId: firstActivity.userDayTrackingId,
      activityIds: activities.map((activity) => activity.activityId),
    });

    const tracking =
      await this._userActivityTrackingRepository.initializeForDay(trackingData);

    console.log("[ActivityTracking] Initialization result", {
      requested: trackingData.length,
      returned: tracking.length,
      trackingIds: tracking.map((item) => item._id.toString()),
    });

    return UserActivityTrackingMapper.toDTOList(tracking);
  }

  async startActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userProgramId, "User program ID");
    this.validateObjectId(userProgramDayId, "Program day ID");
    this.validateObjectId(activityId, "Activity ID");

    const existingTracking = await this.findOwnedActivityTracking(
      userId,
      userProgramId,
      userProgramDayId,
      activityId,
    );

    this.validateActivityCanStart(existingTracking);

    if (existingTracking.status === UserActivityTrackingStatus.IN_PROGRESS) {
      return UserActivityTrackingMapper.toDTO(existingTracking);
    }

    const updatedTracking =
      await this._userActivityTrackingRepository.updateById(
        existingTracking._id,
        {
          status: UserActivityTrackingStatus.IN_PROGRESS,
          startedAt: existingTracking.startedAt ?? new Date(),
          lastUpdatedBy: ActivityCompletedBy.USER,
        },
      );

    if (!updatedTracking) {
      throw new CustomError(
        "Failed to start activity",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    await this.syncDayTracking(updatedTracking.userDayTrackingId);

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }


  async updateActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    data: UpdateActivityTrackingDTO,
  ): Promise<UserActivityTrackingResponseDTO> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userProgramId, "User program ID");
    this.validateObjectId(userProgramDayId, "Program day ID");
    this.validateObjectId(activityId, "Activity ID");

    const dayTracking =
      await this._userDayTrackingRepository.findByProgramAndProgramDay(
        userProgramId,
        userProgramDayId,
      );

    if (!dayTracking) {
      throw new CustomError(
        "Day tracking not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (dayTracking.userId.toString() !== userId) {
      throw new CustomError(
        "You are not authorized to access this activity",
        StatusCode.FORBIDDEN,
      );
    }

    const existingTracking =
      await this._userActivityTrackingRepository.findByDayAndActivity(
        dayTracking._id,
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
      update.completedAt = null;
    }

    if (data.status === UserActivityTrackingStatus.COMPLETED) {
      update.startedAt = existingTracking.startedAt ?? new Date();
      update.completedAt = new Date();
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

    await this.syncDayTracking(updatedTracking.userDayTrackingId);

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }


  async skipActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    skippedReason: string,
  ): Promise<UserActivityTrackingResponseDTO> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userProgramId, "User program ID");
    this.validateObjectId(userProgramDayId, "Program day ID");
    this.validateObjectId(activityId, "Activity ID");

    if (!skippedReason.trim()) {
      throw new CustomError(
        "Skipped reason is required",
        StatusCode.BAD_REQUEST,
      );
    }

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

    if (existingTracking.status === UserActivityTrackingStatus.SKIPPED) {
      return UserActivityTrackingMapper.toDTO(existingTracking);
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
    await this.syncDayTracking(updatedTracking.userDayTrackingId);

    return UserActivityTrackingMapper.toDTO(updatedTracking);
  }

  async getActivityTracking(
    userId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO | null> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userProgramDayId, "Program day ID");
    this.validateObjectId(activityId, "Activity ID");

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
        StatusCode.FORBIDDEN,
      );
    }
    
    return UserActivityTrackingMapper.toDTO(tracking);
  }

  async getDayActivityTracking(
    userId: string,
    userDayTrackingId: string,
  ): Promise<UserActivityTrackingResponseDTO[]> {
    this.validateObjectId(userId, "User ID");
    this.validateObjectId(userDayTrackingId, "Day tracking ID");

    const tracking =
      await this._userActivityTrackingRepository.findByDayTracking(
        userDayTrackingId,
      );

    const userTracking = tracking.filter(
      (activity) => activity.userId.toString() === userId,
    );

    return UserActivityTrackingMapper.toDTOList(userTracking);
  }

  private validateObjectId(value: string, fieldName: string): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
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
        StatusCode.FORBIDDEN,
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



  private async syncDayTracking(
    userDayTrackingId: string | Types.ObjectId,
  ): Promise<void> {
    const dayTracking =
      await this._userDayTrackingRepository.findById(userDayTrackingId);

    if (!dayTracking) {
      throw new CustomError(
        "Day tracking not found",
        StatusCode.NOT_FOUND,
      );
    }

    const activities =
      await this._userActivityTrackingRepository.findByDayTracking(
        userDayTrackingId.toString(),
      );

    const totalActivities = activities.length;
    const completedActivities = activities.filter(
      (activity) =>
        activity.status === UserActivityTrackingStatus.COMPLETED,
    ).length;
    const skippedActivities = activities.filter(
      (activity) =>
        activity.status === UserActivityTrackingStatus.SKIPPED,
    ).length;

    const hasStarted = activities.some(
      (activity) =>
        activity.status !== UserActivityTrackingStatus.NOT_STARTED,
    );

    const isFinished =
      totalActivities > 0 &&
      completedActivities + skippedActivities === totalActivities;

    let status = UserDayTrackingStatus.NOT_STARTED;

    if (isFinished) {
      status =
        completedActivities > 0
          ? UserDayTrackingStatus.COMPLETED
          : UserDayTrackingStatus.SKIPPED;
    } else if (hasStarted) {
      status = UserDayTrackingStatus.IN_PROGRESS;
    }

    const now = new Date();

    const update: Partial<IUserDayTracking> = {
      totalActivities,
      completedActivities,
      skippedActivities,
      status,
      lastActivityAt: now,
      startedAt: hasStarted
        ? dayTracking.startedAt ?? now
        : dayTracking.startedAt,
      completedAt: isFinished
        ? dayTracking.completedAt ?? now
        : null,
    };

    await this._userDayTrackingRepository.updateById(
      dayTracking._id,
      update,
    );
  }

}
