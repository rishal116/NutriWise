import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserMealTracking,
  UserMealTrackingModel,
  UserMealTrackingStatus,
} from "../../../models/userMealTracking.model";

import { IUserMealTrackingRepository } from "../../interfaces/user/IUserMealTrackingRepository";

@injectable()
export class UserMealTrackingRepository
  extends BaseRepository<IUserMealTracking>
  implements IUserMealTrackingRepository
{
  constructor() {
    super(UserMealTrackingModel);
  }

  async findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserMealTracking[]> {
    return this._model
      .find({
        userProgramDayId,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserMealTracking[]>();
  }

  async findByMeal(
    userProgramDayId: string | Types.ObjectId,
    mealId: string | Types.ObjectId,
  ): Promise<IUserMealTracking | null> {
    return this._model
      .findOne({
        userProgramDayId,
        mealId,
      })
      .lean<IUserMealTracking | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserMealTracking[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        createdAt: -1,
      })
      .lean<IUserMealTracking[]>();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: UserMealTrackingStatus,
  ): Promise<IUserMealTracking | null> {
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
      .lean<IUserMealTracking | null>();
  }

  async updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserMealTracking>,
  ): Promise<IUserMealTracking | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserMealTracking | null>();
  }
}
