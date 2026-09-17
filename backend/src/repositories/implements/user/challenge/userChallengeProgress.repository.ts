import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  IUserChallengeProgress,
  UserChallengeProgressModel,
} from "../../../../models/userChallengeProgress.model";

import { IUserChallengeProgressRepository } from "../../../interfaces/user/challenge/IUserChallengeProgressRepository";

import { BaseRepository } from "../../common/base.repository";

@injectable()
export class UserChallengeProgressRepository
  extends BaseRepository<IUserChallengeProgress>
  implements IUserChallengeProgressRepository
{
  constructor() {
    super(UserChallengeProgressModel);
  }

  async findByUserChallengeId(
    userChallengeId: string,
  ): Promise<IUserChallengeProgress[]> {
    return this._model
      .find({
        userChallengeId: new Types.ObjectId(userChallengeId),
      })
      .sort({ completedAt: 1 })
      .lean<IUserChallengeProgress[]>()
      .exec();
  }

  async findByUserChallengeAndDay(
    userChallengeId: string,
    challengeDayId: string,
  ): Promise<IUserChallengeProgress[]> {
    return this._model
      .find({
        userChallengeId: new Types.ObjectId(userChallengeId),
        challengeDayId: new Types.ObjectId(challengeDayId),
      })
      .sort({ completedAt: 1 })
      .lean<IUserChallengeProgress[]>()
      .exec();
  }

  async findByUserChallengeDayAndActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<IUserChallengeProgress | null> {
    return this._model
      .findOne({
        userChallengeId: new Types.ObjectId(userChallengeId),
        challengeDayId: new Types.ObjectId(challengeDayId),
        activityId: new Types.ObjectId(activityId),
      })
      .lean<IUserChallengeProgress | null>()
      .exec();
  }

  async deleteByUserChallengeDayAndActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<boolean> {
    const result = await this._model.deleteOne({
      userChallengeId: new Types.ObjectId(userChallengeId),
      challengeDayId: new Types.ObjectId(challengeDayId),
      activityId: new Types.ObjectId(activityId),
    });

    return result.deletedCount > 0;
  }
}
