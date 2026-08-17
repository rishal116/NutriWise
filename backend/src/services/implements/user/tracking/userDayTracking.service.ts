import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../../types/types";
import {
  IUserDayTracking,
  UserDayTrackingStatus,
} from "../../../../models/userDayTracking.model";
import { IUserDayTrackingService } from "../../../interfaces/user/tracking/IUserDayTrackingService";
import { IUserDayTrackingRepository } from "../../../../repositories/interfaces/user/tracking/IUserDayTrackingRepository";
import { IUserProgramRepository } from "../../../../repositories/interfaces/user/program/IUserProgramRepository";
import { UserDayTrackingDetailsDTO } from "../../../../dtos/user/tracking/user-day-tracking-details.dto";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";

@injectable()
export class UserDayTrackingService implements IUserDayTrackingService {
  constructor(
    @inject(TYPES.IUserDayTrackingRepository)
    private readonly _userDayTrackingRepository: IUserDayTrackingRepository,

    @inject(TYPES.IUserProgramRepository)
    private readonly _userProgramRepository: IUserProgramRepository,
  ) {}

  async initializeDayTracking(
    programId: string | Types.ObjectId,
    programDayId: string | Types.ObjectId,
    dayNumber: number,
    totalActivities: number,
  ): Promise<UserDayTrackingDetailsDTO> {
    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const programDayObjectId =
      typeof programDayId === "string"
        ? new Types.ObjectId(programDayId)
        : programDayId;

    const existingTracking =
      await this._userDayTrackingRepository.findByUserProgramDay(
        programObjectId,
        dayNumber,
      );

    if (existingTracking) {
      return this.toDTO(existingTracking);
    }

    const userProgram =
      await this._userProgramRepository.findById(programObjectId);

    if (!userProgram) {
      throw new CustomError("User program not found", StatusCode.NOT_FOUND);
    }

    const today = new Date();

    const startDate = new Date(userProgram.startDate);

    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    const differenceInMilliseconds = today.getTime() - startDate.getTime();

    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24),
    );

    const currentDay = differenceInDays + 1;

    const isLocked = dayNumber > currentDay;

    const trackingDate = new Date(startDate);

    trackingDate.setDate(trackingDate.getDate() + (dayNumber - 1));

    const trackingData: Partial<IUserDayTracking> = {
      userId: userProgram.userId,
      userProgramId: programObjectId,
      userProgramDayId: programDayObjectId,

      dayNumber,
      date: trackingDate,

      status: UserDayTrackingStatus.NOT_STARTED,

      startedAt: null,
      completedAt: null,
      lastActivityAt: null,

      totalActivities: totalActivities,
      completedActivities: 0,
      skippedActivities: 0,

      overallCompletionPercentage: 0,
      adherenceScore: 0,

      isLocked,
    };

    const tracking = await this._userDayTrackingRepository.create(trackingData);

    return this.toDTO(tracking);
  }

  private toDTO(tracking: IUserDayTracking): UserDayTrackingDetailsDTO {
    return {
      _id: tracking._id.toString(),
      userId: tracking.userId.toString(),
      userProgramId: tracking.userProgramId.toString(),
      userProgramDayId: tracking.userProgramDayId.toString(),

      dayNumber: tracking.dayNumber,
      date: tracking.date,

      status: tracking.status,

      startedAt: tracking.startedAt ?? null,
      completedAt: tracking.completedAt ?? null,
      lastActivityAt: tracking.lastActivityAt ?? null,

      totalActivities: tracking.totalActivities,
      completedActivities: tracking.completedActivities,
      skippedActivities: tracking.skippedActivities,

      overallCompletionPercentage: tracking.overallCompletionPercentage,

      adherenceScore: tracking.adherenceScore,

      isLocked: tracking.isLocked,

      ...(tracking.userNotes !== undefined && {
        userNotes: tracking.userNotes,
      }),

      ...(tracking.nutritionistNotes !== undefined && {
        nutritionistNotes: tracking.nutritionistNotes,
      }),

      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt,
    };
  }
}
