import type {
  DayActivityResult,
  ProgramDaysQuery,
  ProgramDaysResponse,
  ProgramProgressOverview,
  ProgramProgressScope,
} from "../../../types/nutritionist/program-progress/program-progress.types";

export interface INutriProgramProgressRepository {
  findProgramOverview(
    scope: ProgramProgressScope,
  ): Promise<ProgramProgressOverview | null>;

  findProgramDays(
    input: ProgramDaysQuery,
  ): Promise<ProgramDaysResponse | null>;

  findDayActivityResults(
    input: ProgramProgressScope & { dayNumber: number },
  ): Promise<DayActivityResult[] | null>;
}