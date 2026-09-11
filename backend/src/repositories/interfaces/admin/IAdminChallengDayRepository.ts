import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";

import { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";

import { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";

import { IChallengeDay } from "../../../models/challengeDay.model";

import { IBaseRepository } from "../common/IBaseRepository";

export interface IAdminChallengeDayRepository extends IBaseRepository<IChallengeDay> {
  findDays(
    challengeId: string,
    query: AdminChallengeDayListQueryDTO,
  ): Promise<CursorPaginationResult<AdminChallengeDayListItemDTO>>;

  findDayById(
    challengeId: string,
    dayId: string,
  ): Promise<AdminChallengeDayDetailsDTO | null>;
}
