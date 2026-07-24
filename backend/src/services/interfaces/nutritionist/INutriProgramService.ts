import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/program-request.dto";

import {
  ProgramBrowseResponseDTO,
  ProgramDetailsDTO,
} from "../../../dtos/nutritionist/program/program-response.dto";

export interface INutriProgramService {
  getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<ProgramBrowseResponseDTO>;

  getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<ProgramDetailsDTO>;
}
