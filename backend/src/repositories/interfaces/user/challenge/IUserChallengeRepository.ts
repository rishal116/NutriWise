import { IBaseRepository } from "../../common/IBaseRepository";
import { IUserChallenge } from "../../../../models/userChallenge.model";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { UserChallengeListQuery } from "../../../../types/user/challenge/user-challenge-list-query.type";
import { UserChallengeListItem } from "../../../../types/user/challenge/user-challenge-list-item.type";
import { UserChallengeDetailsResult } from "../../../../types/user/challenge/user-challenge-details-result.type";

export interface IUserChallengeRepository extends IBaseRepository<IUserChallenge> {
  browseChallenges(
    userId: string,
    query: UserChallengeListQuery,
  ): Promise<CursorPaginationResult<UserChallengeListItem>>;

  findByIdAndUser(
    userChallengeId: string,
    userId: string,
  ): Promise<UserChallengeDetailsResult | null>;

  findByUserAndChallenge(
    userId: string,
    challengeId: string,
  ): Promise<IUserChallenge | null>;
}
