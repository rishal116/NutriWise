import { injectable } from "inversify";
import {
  ClientSession,
  FilterQuery,
  Types,
  UpdateResult,
} from "mongoose";
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

  async createWithSession(
    data: Partial<IUserProgram>,
    session: ClientSession,
  ): Promise<IUserProgram> {
    const [doc] = await this._model.create([data], { session });
    return doc;
  }

  async findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: "active",
        endDate: { $gt: new Date() },
        isDeleted: false,
      })
      .lean<IUserProgram | null>()
      .exec();
  }

  async findLatestProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean<IUserProgram | null>()
      .exec();
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({
        userId,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({
        nutritionistId,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findOnePopulated(
    filter: FilterQuery<IUserProgram>,
  ): Promise<IUserProgramPopulated | null> {
    return this._model
      .findOne({
        ...filter,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .lean<IUserProgramPopulated | null>()
      .exec();
  }

  async findByUserAndPlan(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
  ): Promise<IUserProgram[]> {
    return this._model
      .find({
        userId,
        planId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean<IUserProgram[]>()
      .exec();
  }

  async findByIdAndUser(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        _id: programId,
        userId,
        isDeleted: false,
      })
      .lean<IUserProgram | null>()
      .exec();
  }

  async updateProgress(
    programId: string | Types.ObjectId,
    currentDay: number,
    completionPercentage: number,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this._model
      .findByIdAndUpdate(
        programId,
        {
          currentDay,
          completionPercentage,
        },
        {
          new: true,
          session,
        },
      )
      .lean<IUserProgram | null>()
      .exec();
  }

  async activateUpcomingPrograms(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        status: "upcoming",
        startDate: { $lte: new Date() },
        isDeleted: false,
      },
      {
        $set: {
          status: "active",
        },
      },
    );
  }

  async completeActivePrograms(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
        isDeleted: false,
      },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      },
    );
  }
}