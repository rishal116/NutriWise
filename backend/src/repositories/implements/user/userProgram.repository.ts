import { injectable } from "inversify";
import { Types, ClientSession } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IUserProgramRepository } from "../../interfaces/user/IUserProgramRepository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";

@injectable()
export class UserProgramRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async create(
    data: Partial<IUserProgram>,
    session?: ClientSession,
  ): Promise<IUserProgram> {
    const doc = await this._model.create([data], { session });
    return doc[0];
  }

  async findActiveByUserAndNutritionist(
    userId: Types.ObjectId,
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: "ACTIVE",
        endDate: { $gt: new Date() },
        isDeleted: false,
      })
      .lean()
      .exec();
  }

  async findLatestProgram(
    userId: Types.ObjectId,
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: { $in: ["ACTIVE", "UPCOMING"] },
        isDeleted: false,
      })
      .sort({ endDate: -1 })
      .lean()
      .exec();
  }

  async findByUser(userId: Types.ObjectId): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({ userId, isDeleted: false })
      .sort({ startDate: -1 })
      .populate("nutritionistId", "fullName email")
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByNutritionist(
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({ nutritionistId, isDeleted: false })
      .sort({ startDate: -1 })
      .populate("userId", "fullName email")
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByIdPopulated(id: string): Promise<IUserProgramPopulated | null> {
    return this._model
      .findById(id)
      .populate("userId", "fullName email")
      .populate("nutritionistId", "fullName email")
      .lean<IUserProgramPopulated>()
      .exec();
  }

  async findByUserAndPlan(
    userId: Types.ObjectId,
    planId: Types.ObjectId,
  ): Promise<IUserProgram[]> {
    return this._model
      .find({ userId, planId, isDeleted: false })
      .sort({ startDate: -1 })
      .lean()
      .exec();
  }

  async findByIdAndUser(
    userId: Types.ObjectId,
    programId: Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({ _id: programId, userId, isDeleted: false })
      .lean()
      .exec();
  }

  async updateProgress(
    programId: Types.ObjectId,
    currentDay: number,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOneAndUpdate(
        { _id: programId, isDeleted: false },
        { currentDay },
        { new: true, session },
      )
      .lean()
      .exec();
  }

  async activatePrograms(): Promise<any> {
    return this._model.updateMany(
      {
        status: "UPCOMING",
        startDate: { $lte: new Date() },
        isDeleted: false,
      },
      {
        $set: { status: "ACTIVE" },
      },
    );
  }

  async completePrograms(): Promise<any> {
    return this._model.updateMany(
      {
        status: "ACTIVE",
        endDate: { $lt: new Date() },
        isDeleted: false,
      },
      {
        $set: { status: "COMPLETED" },
      },
    );
  }
}
