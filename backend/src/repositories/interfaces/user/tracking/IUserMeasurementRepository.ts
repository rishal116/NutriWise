import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import {
  IUserMeasurement,
  UserMeasurementType,
} from "../../../../models/userMeasurement.model";

export interface IUserMeasurementRepository extends IBaseRepository<IUserMeasurement> {
  findByUser(userId: string | Types.ObjectId): Promise<IUserMeasurement[]>;

  findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserMeasurement[]>;

  findByType(
    userId: string | Types.ObjectId,
    type: UserMeasurementType,
  ): Promise<IUserMeasurement[]>;

  findLatestByType(
    userId: string | Types.ObjectId,
    type: UserMeasurementType,
  ): Promise<IUserMeasurement | null>;

  updateMeasurement(
    id: string | Types.ObjectId,
    update: Partial<IUserMeasurement>,
  ): Promise<IUserMeasurement | null>;
}
