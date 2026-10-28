import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import type { IUserDashboardService } from "../../interfaces/user/IUserDashboardService";
import type { IUserDashboardRepository } from "../../../repositories/interfaces/user/account/IUserDashboardRepository";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";
import type { UserDashboardProgramsDTO } from "../../../dtos/user/dashboard/user-dashboard-programs.dto";
import type { UserDashboardTodayTrackingDTO } from "../../../dtos/user/dashboard/user-dashboard-today-tracking.dto";
import type { UserDashboardWeeklyProgressDTO } from "../../../dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import type { UserDashboardConsultationsDTO } from "../../../dtos/user/dashboard/user-dashboard-consultations.dto";
import type { UserDashboardPaymentOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-payment-overview.dto";

import {
  toUserDashboardOverviewDTO,
  toUserDashboardProgramsDTO,
  toUserDashboardTodayTrackingDTO,
  toUserDashboardWeeklyProgressDTO,
  toUserDashboardConsultationsDTO,
  toUserDashboardPaymentOverviewDTO,
} from "../../../mappers/user/dashboard/user-dashboard.mapper";

@injectable()
export class UserDashboardService implements IUserDashboardService {
  constructor(
    @inject(TYPES.IUserDashboardRepository)
    private readonly _userDashboardRepository: IUserDashboardRepository,
  ) {}

  async getOverview(userId: string): Promise<UserDashboardOverviewDTO> {
    this.validateUserId(userId);

    const overview = await this._userDashboardRepository.getOverview(userId);

    if (!overview) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    return toUserDashboardOverviewDTO(overview);
  }

  async getActivePrograms(
    userId: string,
    limit = 5,
  ): Promise<UserDashboardProgramsDTO> {
    this.validateUserId(userId);
    this.validateLimit(limit);

    const programs = await this._userDashboardRepository.getActivePrograms(
      userId,
      limit,
    );

    return toUserDashboardProgramsDTO(programs);
  }

  async getTodayTracking(
    userId: string,
    date = new Date(),
  ): Promise<UserDashboardTodayTrackingDTO> {
    this.validateUserId(userId);
    this.validateDate(date, "date");

    const tracking = await this._userDashboardRepository.getTodayTracking(
      userId,
      date,
    );

    return toUserDashboardTodayTrackingDTO(tracking);
  }

  async getWeeklyProgress(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardWeeklyProgressDTO> {
    this.validateUserId(userId);
    this.validateDateRange(startDate, endDate);

    const progress = await this._userDashboardRepository.getWeeklyProgress(
      userId,
      startDate,
      endDate,
    );

    return toUserDashboardWeeklyProgressDTO(progress);
  }

  async getUpcomingConsultations(
    userId: string,
    limit = 5,
  ): Promise<UserDashboardConsultationsDTO> {
    this.validateUserId(userId);
    this.validateLimit(limit);

    const consultations =
      await this._userDashboardRepository.getUpcomingConsultations(
        userId,
        limit,
      );

    return toUserDashboardConsultationsDTO(consultations);
  }

  async getPaymentOverview(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardPaymentOverviewDTO> {
    this.validateUserId(userId);
    this.validateDateRange(startDate, endDate);

    const overview = await this._userDashboardRepository.getPaymentOverview(
      userId,
      startDate,
      endDate,
    );

    if (!overview) {
      throw new CustomError(
        "Payment overview could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return toUserDashboardPaymentOverviewDTO(overview);
  }

  private validateUserId(userId: string): void {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
  }

  private validateLimit(limit: number): void {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new CustomError(
        "Limit must be an integer between 1 and 50",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validateDate(date: Date, fieldName: string): void {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    this.validateDate(startDate, "start date");
    this.validateDate(endDate, "end date");

    if (startDate >= endDate) {
      throw new CustomError(
        "Start date must be before end date",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
