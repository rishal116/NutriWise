import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";
import type { IBaseRepository } from "../common/IBaseRepository";
import type { IChallenge } from "../../../models/challenge.model";
import type { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";
import type { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

export interface IAdminChallengeRepository extends IBaseRepository<IChallenge> {
  findChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<CursorPaginationResult<AdminChallengeListItem>>;

  findChallengeById(
    challengeId: string,
  ): Promise<AdminChallengeDetailsResult | null>;
}
