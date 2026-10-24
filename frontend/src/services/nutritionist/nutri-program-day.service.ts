import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_PROGRAM_DAY_ROUTES } from "@/routes/nutritionist";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ProgramDayListQueryDTO } from "@/dtos/nutritionist/program/nutri-program-day-list-query.dto";
import type { NutriProgramDayCardResponseDTO } from "@/dtos/nutritionist/program/nutri-program-day-card-response.dto";
import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program/nutri-program-day-response.dto";
import type {
  CreateNutriProgramDayDTO,
  UpdateNutriProgramDayDTO,
} from "@/dtos/nutritionist/program/nutri-program-day-request.dto";

export const nutriProgramDayService = {
  async getProgramDays(
    programId: string,
    query?: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramDayCardResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriProgramDayCardResponseDTO>>
    >(NUTRITIONIST_PROGRAM_DAY_ROUTES.LIST(programId), {
      params: query,
    });

    if (!response.data.data) {
      throw new Error("Program days response data is missing");
    }

    return response.data.data;
  },

  async getProgramDayDetails(
    dayId: string,
  ): Promise<NutriProgramDayResponseDTO> {
    const response = await clientApi.get<
      ApiResponseDTO<NutriProgramDayResponseDTO>
    >(NUTRITIONIST_PROGRAM_DAY_ROUTES.DETAILS(dayId));

    if (!response.data.data) {
      throw new Error("Program day response data is missing");
    }

    return response.data.data;
  },

  async createProgramDay(
    programId: string,
    payload: CreateNutriProgramDayDTO,
  ): Promise<void> {
    await clientApi.post<ApiResponseDTO<void>>(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.CREATE(programId),
      payload,
    );
  },

  async updateProgramDay(
    dayId: string,
    payload: UpdateNutriProgramDayDTO,
  ): Promise<void> {
    await clientApi.patch<ApiResponseDTO<void>>(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.UPDATE(dayId),
      payload,
    );
  },
};
