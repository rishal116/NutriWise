import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import {
  IUserWorkoutTracking,
  UserWorkoutTrackingStatus,
} from "../../../models/userWorkoutTracking.model";

export interface IUserWorkoutTrackingRepository extends IBaseRepository<IUserWorkoutTracking> {
  findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking[]>;

  findByWorkout(
    userProgramDayId: string | Types.ObjectId,
    workoutId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking[]>;

  updateStatus(
    id: string | Types.ObjectId,
    status: UserWorkoutTrackingStatus,
  ): Promise<IUserWorkoutTracking | null>;

  updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserWorkoutTracking>,
  ): Promise<IUserWorkoutTracking | null>;
}
