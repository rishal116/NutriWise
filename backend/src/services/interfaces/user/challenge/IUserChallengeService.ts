import { UserChallengeDTO } from "../../../../dtos/user/challenge/user-challenge.dto";
import { UserChallengeDetailsDTO } from "../../../../dtos/user/challenge/user-challenge-details.dto";
import { UserChallengeListQueryDTO } from "../../../../dtos/user/challenge/user-challenge-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserChallengeCardDTO } from "../../../../dtos/user/challenge/user-challenge-card.dto";

export interface IUserChallengeService {
  joinChallenge(userId: string, challengeId: string): Promise<UserChallengeDTO>;

  browseChallenges(
    userId: string,
    query: UserChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserChallengeCardDTO>>;

  getChallenge(
    userId: string,
    userChallengeId: string,
  ): Promise<UserChallengeDetailsDTO>;
}
