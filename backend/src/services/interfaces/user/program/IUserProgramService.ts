import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import { IUserProgramCardResponseDTO } from "../../../../dtos/user/program/user-program-card-response.dto";
import { IUserProgramDetailsResponseDTO } from "../../../../dtos/user/program/user-program-details-response.dto";

export interface IUserProgramService {
  browsePrograms(
    userId: string,
    query: UserProgramListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<IUserProgramCardResponseDTO>>;

  getProgramDetails(
    programId: string,
    userId: string,
  ): Promise<IUserProgramDetailsResponseDTO>;
}
