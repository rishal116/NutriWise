import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserWorkoutTracking,
  UserWorkoutTrackingModel,
  UserWorkoutTrackingStatus,
} from "../../../models/userWorkoutTracking.model";

import { IUserWorkoutTrackingRepository } from "../../interfaces/user/IUserWorkoutTrackingRepository";

@injectable()   
export class UserWorkoutTrackingRepository
  extends BaseRepository<IUserWorkoutTracking>
  implements IUserWorkoutTrackingRepository
{
  constructor() {
    super(UserWorkoutTrackingModel);
  }

  async findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking[]> {
    return this._model
      .find({
        userProgramDayId,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserWorkoutTracking[]>();
  }

  async findByWorkout(
    userProgramDayId: string | Types.ObjectId,
    workoutId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking | null> {
    return this._model
      .findOne({
        userProgramDayId,
        workoutId,
      })
      .lean<IUserWorkoutTracking | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWorkoutTracking[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        createdAt: -1,
      })
      .lean<IUserWorkoutTracking[]>();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: UserWorkoutTrackingStatus,
  ): Promise<IUserWorkoutTracking | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserWorkoutTracking | null>();
  }

  async updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserWorkoutTracking>,
  ): Promise<IUserWorkoutTracking | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserWorkoutTracking | null>();
  }
}
