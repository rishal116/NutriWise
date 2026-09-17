import { UserChallengeDTO } from "../../../dtos/user/challenge/user-challenge.dto";

import { IUserChallenge } from "../../../models/userChallenge.model";

export const toUserChallengeDTO = (
  userChallenge: IUserChallenge,
): UserChallengeDTO => {
  return new UserChallengeDTO({
    id: userChallenge._id.toString(),
    challengeId: userChallenge.challengeId.toString(),
    status: userChallenge.status,
    joinedAt: userChallenge.joinedAt,
    startedAt: userChallenge.startedAt,
    currentDay: userChallenge.currentDay,
    progressPercentage: userChallenge.progressPercentage,
    currentStreak: userChallenge.currentStreak,
    longestStreak: userChallenge.longestStreak,
    completedAt: userChallenge.completedAt,
  });
};