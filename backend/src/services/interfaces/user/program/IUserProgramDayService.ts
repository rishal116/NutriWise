import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramDayDetailsResponseDTO } from "../../../../dtos/user/program/user-program-day-details-response.dto";
import { UserProgramDayListQueryDTO } from "../../../../dtos/user/program/user-program-day-list-query.dto";
import { UserProgramDayListResponseDTO } from "../../../../dtos/user/program/user-program-day-list-response.dto";

export interface IUserProgramDayService {
  browseProgramDays(
    userId: string,
    programId: string,
    query: UserProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramDayListResponseDTO>>;

  getDayDetails(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<UserProgramDayDetailsResponseDTO>;
}
