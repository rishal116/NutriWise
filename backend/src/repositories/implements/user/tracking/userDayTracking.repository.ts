import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserDayTracking,
  UserDayTrackingModel,
  UserDayTrackingStatus,
} from "../../../../models/userDayTracking.model";
import { IUserDayTrackingRepository } from "../../../interfaces/user/tracking/IUserDayTrackingRepository";

@injectable()
export class UserDayTrackingRepository
  extends BaseRepository<IUserDayTracking>
  implements IUserDayTrackingRepository
{
  constructor() {
    super(UserDayTrackingModel);
  }

  async findByUserProgramDay(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findOne({ userProgramId, dayNumber })
      .lean<IUserDayTracking | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking[]> {
    return this._model
      .find({ userProgramId })
      .sort({ dayNumber: 1 })
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
      .sort({ dayNumber: 1 })
      .lean<IUserDayTracking | null>();
  }

  async findOrCreateForProgramDay(
    trackingData: Partial<IUserDayTracking> & {
      userProgramId: Types.ObjectId;
      userProgramDayId: Types.ObjectId;
      dayNumber: number;
    },
  ): Promise<IUserDayTracking> {
    const tracking = await this._model.findOneAndUpdate(
      {
        userProgramId: trackingData.userProgramId,
        dayNumber: trackingData.dayNumber,
      },
      {
        $setOnInsert: trackingData,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    if (!tracking) {
      throw new Error("Failed to find or create user day tracking");
    }

    return tracking;
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: UserDayTrackingStatus,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true },
      )
      .lean<IUserDayTracking | null>();
  }

  async lock(id: string | Types.ObjectId): Promise<IUserDayTracking | null> {
    return this._model
      .findOneAndUpdate(
        { _id: id, isLocked: false },
        { $set: { isLocked: true } },
        { new: true, runValidators: true },
      )
      .lean<IUserDayTracking | null>();
  }

  async unlock(id: string | Types.ObjectId): Promise<IUserDayTracking | null> {
    return this._model
      .findOneAndUpdate(
        { _id: id, isLocked: true },
        { $set: { isLocked: false } },
        { new: true, runValidators: true },
      )
      .lean<IUserDayTracking | null>();
  }

  async findByProgramAndProgramDay(
    userProgramId: string | Types.ObjectId,
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserDayTracking | null> {
    return this._model
      .findOne({ userProgramId, userProgramDayId })
      .lean<IUserDayTracking | null>();
  }
}
