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
        { status },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserDayTracking | null>();
  }

  async lock(id: string | Types.ObjectId): Promise<IUserDayTracking | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        { isLocked: true },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserDayTracking | null>();
  }

  async unlock(id: string | Types.ObjectId): Promise<IUserDayTracking | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        { isLocked: false },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserDayTracking | null>();
  }
}
