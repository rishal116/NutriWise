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
    if (!Types.ObjectId.isValid(programId)) {
      throw new CustomError("Invalid user program ID", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(programDayId)) {
      throw new CustomError("Invalid program day ID", StatusCode.BAD_REQUEST);
    }

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw new CustomError(
        "Day number must be a positive integer",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!Number.isInteger(totalActivities) || totalActivities < 0) {
      throw new CustomError(
        "Total activities must be a non-negative integer",
        StatusCode.BAD_REQUEST,
      );
    }

    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const programDayObjectId =
      typeof programDayId === "string"
        ? new Types.ObjectId(programDayId)
        : programDayId;

    // Return existing tracking without resetting progress.
    const existingTracking =
      await this._userDayTrackingRepository.findByUserProgramDay(
        programObjectId,
        dayNumber,
      );

    if (existingTracking) {
      if (!existingTracking.userProgramDayId.equals(programDayObjectId)) {
        throw new CustomError(
          "Day tracking already exists for a different program day",
          StatusCode.CONFLICT,
        );
      }

      return this.toDTO(existingTracking);
    }

    const userProgram =
      await this._userProgramRepository.findById(programObjectId);

    if (!userProgram) {
      throw new CustomError("User program not found", StatusCode.NOT_FOUND);
    }

    const startDate = new Date(userProgram.startDate);

    if (Number.isNaN(startDate.getTime())) {
      throw new CustomError(
        "User program has an invalid start date",
        StatusCode.BAD_REQUEST,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.round(
      (today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    const currentDay = differenceInDays + 1;
    const isLocked = dayNumber > currentDay;

    const trackingDate = new Date(startDate);
    trackingDate.setDate(trackingDate.getDate() + dayNumber - 1);

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
      totalActivities,
      completedActivities: 0,
      skippedActivities: 0,
      isLocked,
    };

    const tracking =
      await this._userDayTrackingRepository.findOrCreateForProgramDay({
        ...trackingData,
        userProgramId: programObjectId,
        userProgramDayId: programDayObjectId,
        dayNumber,
      });

    if (!tracking.userProgramDayId.equals(programDayObjectId)) {
      throw new CustomError(
        "Day tracking already exists for a different program day",
        StatusCode.CONFLICT,
      );
    }

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
