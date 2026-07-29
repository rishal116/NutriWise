import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_PROGRAM_ROUTES } from "@/routes/nutritionist";

import type { GetProgramsQuery } from "@/dtos/nutritionist/program/program-request.dto";

import type {
  ProgramBrowseResponse,
  ProgramSummary,
} from "@/dtos/nutritionist/program/program-response.dto";

export const nutriProgramService = {
  async getPrograms(query?: GetProgramsQuery): Promise<ProgramBrowseResponse> {
    const { data } = await clientApi.get(NUTRITIONIST_PROGRAM_ROUTES.LIST, {
      params: query,
    });

    return data.data;
  },

  async getProgramDetails(programId: string): Promise<ProgramSummary> {
    const { data } = await clientApi.get(
      NUTRITIONIST_PROGRAM_ROUTES.DETAILS(programId),
    );

    return data.data;
  },
};
