import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { INutriProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-card-response.dto";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/nutri-program-day-list-query.dto";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/nutri-program-day-request.dto";
import { INutriProgramDayResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-response.dto";

export interface INutriProgramDayService {
  getProgramDays(
    nutritionistId: string,
    programId: string,
    query: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<INutriProgramDayCardResponseDTO>>;

  getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<INutriProgramDayResponseDTO>;

  createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<void>;

  updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<void>;
}
