import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/program-day-card-response.dto";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/program-day-list-query.dto";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";
import { ProgramDayResponseDTO } from "../../../dtos/nutritionist/program/program-day-response.dto";

export interface INutriProgramDayService {
  getProgramDays(
    nutritionistId: string,
    programId: string,
    query: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ProgramDayCardResponseDTO>>;

  getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<ProgramDayResponseDTO>;

  createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO>;

  updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO>;

  deleteProgramDay(nutritionistId: string, dayId: string): Promise<void>;
}
