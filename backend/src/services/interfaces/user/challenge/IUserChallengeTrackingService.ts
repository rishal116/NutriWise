import { UserChallengeDetailsDTO } from "../../../../dtos/user/challenge/user-challenge-details.dto";

export interface IUserChallengeTrackingService {
  completeActivity(
    userId: string,
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<UserChallengeDetailsDTO>;

  uncompleteActivity(
    userId: string,
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<UserChallengeDetailsDTO>;
}