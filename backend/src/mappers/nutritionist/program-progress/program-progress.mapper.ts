import type {
  DayActivityResult,
  ProgramDaySummary,
  ProgramProgressOverview,
} from "../../../types/nutritionist/program-progress/program-progress.types";

import type { ProgramProgressResponseDTO } from "../../../dtos/nutritionist/program-progress/program-progress-response.dto";
import type { ProgramDaySummaryResponseDTO } from "../../../dtos/nutritionist/program-progress/program-day-summary-response.dto";
import type { DayActivityResultResponseDTO } from "../../../dtos/nutritionist/program-progress/day-activity-result-response.dto";

export class ProgramProgressMapper {
  static toOverviewResponse(
    overview: ProgramProgressOverview,
  ): ProgramProgressResponseDTO {
    return {
      ...overview,
    };
  }

  static toDaySummaryResponse(
    day: ProgramDaySummary,
  ): ProgramDaySummaryResponseDTO {
    return {
      ...day,
    };
  }

  static toDayActivityResultResponse(
    activity: DayActivityResult,
  ): DayActivityResultResponseDTO {
    return {
      ...activity,
      evidence: [...activity.evidence],
    };
  }
}
