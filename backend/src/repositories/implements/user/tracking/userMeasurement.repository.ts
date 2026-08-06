import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserMeasurement,
  UserMeasurementModel,
  UserMeasurementType,
} from "../../../../models/userMeasurement.model";
import { IUserMeasurementRepository } from "../../../interfaces/user/tracking/IUserMeasurementRepository";

@injectable()
export class UserMeasurementRepository
  extends BaseRepository<IUserMeasurement>
  implements IUserMeasurementRepository
{
  constructor() {
    super(UserMeasurementModel);
  }

  async findByUser(
    userId: string | Types.ObjectId,
  ): Promise<IUserMeasurement[]> {
    return this._model
      .find({
        userId,
      })
      .sort({
        date: -1,
      })
      .lean<IUserMeasurement[]>();
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserMeasurement[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        date: -1,
      })
      .lean<IUserMeasurement[]>();
  }

  async findByType(
    userId: string | Types.ObjectId,
    type: UserMeasurementType,
  ): Promise<IUserMeasurement[]> {
    return this._model
      .find({
        userId,
        type,
      })
      .sort({
        date: -1,
      })
      .lean<IUserMeasurement[]>();
  }

  async findLatestByType(
    userId: string | Types.ObjectId,
    type: UserMeasurementType,
  ): Promise<IUserMeasurement | null> {
    return this._model
      .findOne({
        userId,
        type,
      })
      .sort({
        date: -1,
      })
      .lean<IUserMeasurement | null>();
  }

  async updateMeasurement(
    id: string | Types.ObjectId,
    update: Partial<IUserMeasurement>,
  ): Promise<IUserMeasurement | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserMeasurement | null>();
  }
}
