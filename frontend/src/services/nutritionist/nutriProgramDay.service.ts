import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_PROGRAM_DAY_ROUTES } from "@/routes/nutritionist";

import type {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "@/dtos/nutritionist/program/program-day-request.dto";

import type {
  ProgramDayBrowseResponseDTO,
  ProgramDayDetailsDTO,
} from "@/dtos/nutritionist/program/program-day-response.dto";

export const nutriProgramDayService = {
  async getProgramDays(
    programId: string,
  ): Promise<ProgramDayBrowseResponseDTO> {
    const { data } = await clientApi.get(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.LIST(programId),
    );
    return data.data;
  },

  async getProgramDayDetails(dayId: string): Promise<ProgramDayDetailsDTO> {
    const { data } = await clientApi.get(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.DETAILS(dayId),
    );

    return data.data;
  },

  async createProgramDay(
    programId: string,
    payload: CreateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO> {
    const { data } = await clientApi.post(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.CREATE(programId),
      payload,
    );

    return data.data;
  },

  async updateProgramDay(
    dayId: string,
    payload: UpdateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO> {
    const { data } = await clientApi.patch(
      NUTRITIONIST_PROGRAM_DAY_ROUTES.UPDATE(dayId),
      payload,
    );

    return data.data;
  },

  async deleteProgramDay(dayId: string): Promise<void> {
    await clientApi.delete(NUTRITIONIST_PROGRAM_DAY_ROUTES.DELETE(dayId));
  },
};
