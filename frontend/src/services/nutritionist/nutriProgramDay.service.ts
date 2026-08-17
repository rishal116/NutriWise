import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_PROGRAM_DAY_ROUTES } from "@/routes/nutritionist";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import type { ProgramDayListQueryDTO } from "@/dtos/nutritionist/program/program-day-list-query.dto";

import type { ProgramDayCardResponseDTO } from "@/dtos/nutritionist/program/program-day-card-response.dto";

import type { ProgramDayResponseDTO } from "@/dtos/nutritionist/program/program-day-response.dto";

import type {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "@/dtos/nutritionist/program/program-day-request.dto";

export const nutriProgramDayService = {
  async getProgramDays(
    programId: string,
    query?: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ProgramDayCardResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ProgramDayCardResponseDTO>>
    >(NUTRITIONIST_PROGRAM_DAY_ROUTES.LIST(programId), {
      params: query,
    });

    return response.data.data;
  },

  async getProgramDayDetails(dayId: string): Promise<ProgramDayResponseDTO> {
    const response = await clientApi.get<ApiResponseDTO<ProgramDayResponseDTO>>(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.DETAILS(dayId),
    );

    return response.data.data;
  },

  async createProgramDay(
    programId: string,
    payload: CreateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO> {
    const response = await clientApi.post<
      ApiResponseDTO<ProgramDayResponseDTO>
    >(NUTRITIONIST_PROGRAM_DAY_ROUTES.CREATE(programId), payload);

    return response.data.data;
  },

  async updateProgramDay(
    dayId: string,
    payload: UpdateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO> {
    const response = await clientApi.patch<
      ApiResponseDTO<ProgramDayResponseDTO>
    >(NUTRITIONIST_PROGRAM_DAY_ROUTES.UPDATE(dayId), payload);

    return response.data.data;
  },

  async deleteProgramDay(dayId: string): Promise<void> {
    await clientApi.delete(NUTRITIONIST_PROGRAM_DAY_ROUTES.DELETE(dayId));
  },
};
