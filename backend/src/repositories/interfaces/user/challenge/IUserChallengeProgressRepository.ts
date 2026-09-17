import { IBaseRepository } from "../../common/IBaseRepository";

import { IUserChallengeProgress } from "../../../../models/userChallengeProgress.model";

export interface IUserChallengeProgressRepository
  extends IBaseRepository<IUserChallengeProgress> {
  findByUserChallengeId(
    userChallengeId: string,
  ): Promise<IUserChallengeProgress[]>;

  findByUserChallengeAndDay(
    userChallengeId: string,
    challengeDayId: string,
  ): Promise<IUserChallengeProgress[]>;

  findByUserChallengeDayAndActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<IUserChallengeProgress | null>;

  deleteByUserChallengeDayAndActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<boolean>;
}