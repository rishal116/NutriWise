import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserActivityTracking,
  UserActivityTrackingModel,
  UserActivityTrackingStatus,
} from "../../../../models/userActivityTracking.model";
import { ProgramActivityCategory } from "../../../../models/userProgramDay.model";
import { IUserActivityTrackingRepository } from "../../../interfaces/user/tracking/IUserActivityTrackingRepository";

@injectable()
export class UserActivityTrackingRepository
  extends BaseRepository<IUserActivityTracking>
  implements IUserActivityTrackingRepository
{
  constructor() {
    super(UserActivityTrackingModel);
  }

  async findByDayTracking(
    userDayTrackingId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({
        userDayTrackingId,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserActivityTracking[]>();
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        completedAt: -1,
      })
      .lean<IUserActivityTracking[]>();
  }

  async findByActivity(
    activityId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking | null> {
    return this._model
      .findOne({
        activityId,
      })
      .lean<IUserActivityTracking | null>();
  }

  async findByStatus(
    userProgramId: string | Types.ObjectId,
    status: UserActivityTrackingStatus,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({
        userProgramId,
        status,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserActivityTracking[]>();
  }

  async findByCategory(
    userProgramId: string | Types.ObjectId,
    category: ProgramActivityCategory,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({
        userProgramId,
        category,
      })
      .sort({
        createdAt: 1,
      })
      .lean<IUserActivityTracking[]>();
  }

  async updateActivity(
    id: string | Types.ObjectId,
    update: Partial<IUserActivityTracking>,
  ): Promise<IUserActivityTracking | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserActivityTracking | null>();
  }
}
