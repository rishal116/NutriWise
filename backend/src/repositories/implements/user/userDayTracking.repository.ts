import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserDayTracking,
  UserDayTrackingModel,
  UserDayTrackingStatus,
} from "../../../models/userDayTracking.model";

import { IUserDayTrackingRepository } from "../../interfaces/user/IUserDayTrackingRepository";

@injectable()
export class UserDayTrackingRepository
  extends BaseRepository<IUserDayTracking>
  implements IUserDayTrackingRepository
{
  constructor() {
    super(UserDayTrackingModel);
  }

  async findByProgramDay(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findOne({
        userProgramId,
        dayNumber,
      })
      .lean<IUserDayTracking | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        dayNumber: 1,
      })
      .lean<IUserDayTracking[]>();
  }

  async findCurrentDay(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findOne({
        userProgramId,
        status: UserDayTrackingStatus.IN_PROGRESS,
      })
      .lean<IUserDayTracking | null>();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: UserDayTrackingStatus,
  ): Promise<IUserDayTracking | null> {
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
      .lean<IUserDayTracking | null>();
  }

  async updateProgress(
    id: string | Types.ObjectId,
    mealCompletionPercentage: number,
    workoutCompletionPercentage: number,
    habitCompletionPercentage: number,
    overallCompletionPercentage: number,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        {
          mealCompletionPercentage,
          workoutCompletionPercentage,
          habitCompletionPercentage,
          overallCompletionPercentage,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserDayTracking | null>();
  }
}
