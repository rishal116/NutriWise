import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramListQueryDTO } from "../../../dtos/user/program/user-Program-list-query.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";
import { UserProgramDetailsResponseDTO } from "../../../dtos/user/program/user-program-details-response.dto";

export interface IUserProgramService {
  browsePrograms(
    userId: string,
    query: UserProgramListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>>;

  getProgramDetails(
    programId: string,
    userId: string,
  ): Promise<UserProgramDetailsResponseDTO>;
}
