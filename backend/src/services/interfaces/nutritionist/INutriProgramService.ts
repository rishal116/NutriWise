import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CancelNutriProgramDTO } from "../../../dtos/nutritionist/program/cancel-nutri-program.dto";
import { NutriProgramCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-card-response.dto";
import { NutriProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-details-response.dto";
import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/nutri-program-request.dto";

export interface INutriProgramService {
  getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramCardResponseDTO>>;

  getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<NutriProgramDetailsResponseDTO>;

  markProgramAsReady(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<void>;

  cancelProgram(
    nutritionistId: string,
    params: GetProgramParamsDTO,
    body: CancelNutriProgramDTO,
  ): Promise<void>;
}
