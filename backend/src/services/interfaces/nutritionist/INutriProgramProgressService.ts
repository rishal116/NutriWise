import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { GetProgramOverviewDTO } from "../../../dtos/nutritionist/program-progress/get-program-overview.dto";
import type { GetProgramDaysDTO } from "../../../dtos/nutritionist/program-progress/get-program-days.dto";
import type { GetDayActivityResultsDTO } from "../../../dtos/nutritionist/program-progress/get-day-activity-results.dto";

import type { ProgramProgressResponseDTO } from "../../../dtos/nutritionist/program-progress/program-progress-response.dto";
import type { ProgramDaySummaryResponseDTO } from "../../../dtos/nutritionist/program-progress/program-day-summary-response.dto";
import type { DayActivityResultResponseDTO } from "../../../dtos/nutritionist/program-progress/day-activity-result-response.dto";

export interface INutriProgramProgressService {
  getProgramOverview(
    nutritionistId: string,
    dto: GetProgramOverviewDTO,
  ): Promise<ProgramProgressResponseDTO>;

  getProgramDays(
    nutritionistId: string,
    dto: GetProgramDaysDTO,
  ): Promise<InfiniteScrollResponseDTO<ProgramDaySummaryResponseDTO>>;

  getDayActivityResults(
    nutritionistId: string,
    dto: GetDayActivityResultsDTO,
  ): Promise<DayActivityResultResponseDTO[]>;
}