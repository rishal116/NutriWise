import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutriProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program-day/nutri-program-day-card-response.dto";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program-day/nutri-program-day-list-query.dto";
import { UpdateProgramDayDTO } from "../../../dtos/nutritionist/program-day/nutri-program-day-request.dto";
import { INutriProgramDayResponseDTO } from "../../../dtos/nutritionist/program-day/nutri-program-day-response.dto";

export interface INutriProgramDayService {
  getProgramDays(
    nutritionistId: string,
    programId: string,
    query: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramDayCardResponseDTO>>;

  getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<INutriProgramDayResponseDTO>;

  updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<void>;
}
