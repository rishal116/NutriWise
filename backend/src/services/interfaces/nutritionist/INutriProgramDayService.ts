import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";

import {
  ProgramDayBrowseResponseDTO,
  ProgramDayDetailsDTO,
} from "../../../dtos/nutritionist/program/program-day-response.dto";

export interface INutriProgramDayService {
  getProgramDays(
    nutritionistId: string,
    programId: string,
  ): Promise<ProgramDayBrowseResponseDTO>;

  getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<ProgramDayDetailsDTO>;

  createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO>;

  updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO>;

  deleteProgramDay(
    nutritionistId: string,
    dayId: string,
  ): Promise<void>;
}