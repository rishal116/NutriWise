import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  CreateUserActivityTrackingData,
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
      .find({ userDayTrackingId })
      .sort({ createdAt: 1, _id: 1 })
      .lean<IUserActivityTracking[]>();
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({ userProgramId })
      .sort({ createdAt: 1, _id: 1 })
      .lean<IUserActivityTracking[]>();
  }

  async findByDayAndActivity(
    userDayTrackingId: string | Types.ObjectId,
    activityId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking | null> {
    return this._model
      .findOne({ userDayTrackingId, activityId })
      .lean<IUserActivityTracking | null>();
  }

  async findByStatus(
    userProgramId: string | Types.ObjectId,
    status: UserActivityTrackingStatus,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({ userProgramId, status })
      .sort({ createdAt: 1, _id: 1 })
      .lean<IUserActivityTracking[]>();
  }

  async findByCategory(
    userProgramId: string | Types.ObjectId,
    category: ProgramActivityCategory,
  ): Promise<IUserActivityTracking[]> {
    return this._model
      .find({ userProgramId, category })
      .sort({ createdAt: 1, _id: 1 })
      .lean<IUserActivityTracking[]>();
  }

  async initializeForDay(
    activities: CreateUserActivityTrackingData[],
  ): Promise<IUserActivityTracking[]> {
    if (activities.length === 0) {
      return [];
    }

    const operations = activities.map((activity) => ({
      updateOne: {
        filter: {
          userDayTrackingId: activity.userDayTrackingId,
          activityId: activity.activityId,
        },
        update: {
          $setOnInsert: activity,
        },
        upsert: true,
      },
    }));

    await this._model.bulkWrite(operations, { ordered: true });

    return this._model
      .find({
        userDayTrackingId: activities[0].userDayTrackingId,
      })
      .sort({ createdAt: 1, _id: 1 })
      .lean<IUserActivityTracking[]>();
  }
}
