import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import {
  IUserHabitTracking,
  UserHabitTrackingStatus,
} from "../../../models/userHabitTracking.model";

export interface IUserHabitTrackingRepository extends IBaseRepository<IUserHabitTracking> {
  findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking[]>;

  findByHabit(
    userProgramDayId: string | Types.ObjectId,
    habitId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking[]>;

  updateStatus(
    id: string | Types.ObjectId,
    status: UserHabitTrackingStatus,
  ): Promise<IUserHabitTracking | null>;

  updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserHabitTracking>,
  ): Promise<IUserHabitTracking | null>;
}
