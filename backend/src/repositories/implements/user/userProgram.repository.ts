import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IUserProgramRepository } from "../../interfaces/user/IUserProgramRepository";
import { IUserProgram, UserProgramModel } from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";

@injectable()
export class UserProgramRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

 
  async findActiveByUser(userId: Types.ObjectId): Promise<IUserProgram | null> {
    return this._model
      .findOne({ userId, status: "ACTIVE", isDeleted: false })
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
    nutritionistId: Types.ObjectId
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({ nutritionistId, isDeleted: false })
      .sort({ startDate: -1 })
      .populate("userId", "fullName email")
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByIdPopulated(
    id: string
  ): Promise<IUserProgramPopulated | null> {
    return this._model
      .findById(id)
      .populate("userId", "fullName email")
      .populate("nutritionistId", "fullName email")
      .lean<IUserProgramPopulated>()
      .exec();
  }


  async findByUserAndPlan(
    userId: Types.ObjectId,
    planId: Types.ObjectId
  ): Promise<IUserProgram[]> {
    return this._model
      .find({ userId, planId, isDeleted: false })
      .sort({ startDate: -1 })
      .lean()
      .exec();
  }

  async updateProgress(
    programId: Types.ObjectId,
    currentDay: number
  ): Promise<IUserProgram | null> {
    return this._model
      .findOneAndUpdate(
        { _id: programId, isDeleted: false },
        { currentDay },
        { new: true }
      )
      .lean()
      .exec();
  }
}