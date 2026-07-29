import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserHabitTracking,
  UserHabitTrackingModel,
  UserHabitTrackingStatus,
} from "../../../models/userHabitTracking.model";

import { IUserHabitTrackingRepository } from "../../interfaces/user/IUserHabitTrackingRepository";

@injectable()
export class UserHabitTrackingRepository
  extends BaseRepository<IUserHabitTracking>
  implements IUserHabitTrackingRepository
{
  constructor() {
    super(UserHabitTrackingModel);
  }

  async findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking[]> {
    return this._model
      .find({
        userProgramDayId,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserHabitTracking[]>();
  }

  async findByHabit(
    userProgramDayId: string | Types.ObjectId,
    habitId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking | null> {
    return this._model
      .findOne({
        userProgramDayId,
        habitId,
      })
      .lean<IUserHabitTracking | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserHabitTracking[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        createdAt: -1,
      })
      .lean<IUserHabitTracking[]>();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: UserHabitTrackingStatus,
  ): Promise<IUserHabitTracking | null> {
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
      .lean<IUserHabitTracking | null>();
  }

  async updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserHabitTracking>,
  ): Promise<IUserHabitTracking | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserHabitTracking | null>();
  }
}
