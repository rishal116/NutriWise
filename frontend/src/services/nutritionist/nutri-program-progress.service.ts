import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_PROGRAM_PROGRESS_ROUTES } from "@/routes/nutritionist/program-progress.routes";

import type {
  ProgramProgressResponseDTO,
  ProgramDaySummaryResponseDTO,
  DayActivityResultResponseDTO,
} from "@/dtos/nutritionist/program-progress/program-progress-response.dto";
import type { GetProgramDaysQueryDTO } from "@/dtos/nutritionist/program-progress/program-progress-request.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

function requireData<T>(response: ApiResponseDTO<T>): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "The server returned no data");
  }

  return response.data;
}

export const nutriProgramProgressService = {
  async getProgramOverview(
    clientId: string,
    userProgramId: string,
  ): Promise<ProgramProgressResponseDTO> {
    const res = await clientApi.get<ApiResponseDTO<ProgramProgressResponseDTO>>(
      NUTRITIONIST_PROGRAM_PROGRESS_ROUTES.OVERVIEW(clientId, userProgramId),
    );

    return requireData(res.data);
  },

  async getProgramDays(
    clientId: string,
    userProgramId: string,
    query: GetProgramDaysQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ProgramDaySummaryResponseDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ProgramDaySummaryResponseDTO>>
    >(NUTRITIONIST_PROGRAM_PROGRESS_ROUTES.DAYS(clientId, userProgramId), {
      params: query,
    });

    return requireData(res.data);
  },

  async getDayActivityResults(
    clientId: string,
    userProgramId: string,
    dayNumber: number,
  ): Promise<DayActivityResultResponseDTO[]> {
    const res = await clientApi.get<
      ApiResponseDTO<DayActivityResultResponseDTO[]>
    >(
      NUTRITIONIST_PROGRAM_PROGRESS_ROUTES.DAY_ACTIVITIES(
        clientId,
        userProgramId,
        dayNumber,
      ),
    );

    return requireData(res.data);
  },
};
