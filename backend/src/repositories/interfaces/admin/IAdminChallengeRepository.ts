import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";

import { IBaseRepository } from "../common/IBaseRepository";
import { IChallenge } from "../../../models/challenge.model";
import { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";
import { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

export interface IAdminChallengeRepository extends IBaseRepository<IChallenge> {
  findChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<CursorPaginationResult<AdminChallengeListItem>>;

  findChallengeById(
    challengeId: string,
  ): Promise<AdminChallengeDetailsResult | null>;
}
