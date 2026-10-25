import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";
import { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";
import { CreateChallengeDayDTO } from "../../../dtos/admin/challenge-day/create-challenge-day.dto";
import { UpdateChallengeDayDTO } from "../../../dtos/admin/challenge-day/update-challenge-day.dto";
import { ChallengeDayUploadedFiles } from "../../../types/admin/challenge-day/challenge-day-files.types";

export interface IAdminChallengeDayService {
  createDay(
    challengeId: string,
    data: CreateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<void>;

  updateDay(
    challengeId: string,
    dayId: string,
    data: UpdateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<void>;

  browseDays(
    challengeId: string,
    query: AdminChallengeDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>>;

  getDay(
    challengeId: string,
    dayId: string,
  ): Promise<AdminChallengeDayDetailsDTO>;

  deleteDay(challengeId: string, dayId: string): Promise<void>;
}
