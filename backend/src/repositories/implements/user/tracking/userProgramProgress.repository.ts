import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserProgramProgress,
  UserProgramProgressModel,
} from "../../../../models/userProgramProgress.model";
import { IUserProgramProgressRepository } from "../../../interfaces/user/tracking/IUserProgramProgressRepository";

@injectable()
export class UserProgramProgressRepository
  extends BaseRepository<IUserProgramProgress>
  implements IUserProgramProgressRepository
{
  constructor() {
    super(UserProgramProgressModel);
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserProgramProgress | null> {
    return this._model
      .findOne({
        userProgramId,
      })
      .lean<IUserProgramProgress | null>();
  }

  async findByUser(
    userId: string | Types.ObjectId,
  ): Promise<IUserProgramProgress[]> {
    return this._model
      .find({
        userId,
      })
      .sort({
        completionPercentage: -1,
        updatedAt: -1,
      })
      .lean<IUserProgramProgress[]>();
  }

  async updateProgress(
    id: string | Types.ObjectId,
    update: Partial<IUserProgramProgress>,
  ): Promise<IUserProgramProgress | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserProgramProgress | null>();
  }
}
