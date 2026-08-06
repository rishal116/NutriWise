import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/nutritionist/program/program-card-response.dto";
import { UserProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/program-details-response.dto";
import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/program-request.dto";

export interface INutriProgramService {
  getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>>;

  getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<UserProgramDetailsResponseDTO>;
}
