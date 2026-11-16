import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_HEALTH_ROUTES } from "@/routes/user";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { CreateProgramHealthDTO } from "@/dtos/user/program-health/create-program-health.dto";
import type { UpdateProgramHealthDTO } from "@/dtos/user/program-health/update-program-health.dto";
import type { ProgramHealthResponseDTO } from "@/dtos/user/program-health/program-health-response.dto";

export const userProgramHealthService = {
  async createProgramHealth(
    programId: string,
    data: CreateProgramHealthDTO,
  ): Promise<ApiResponseDTO<void>> {
    const res = await clientApi.post<ApiResponseDTO<void>>(
      USER_PROGRAM_HEALTH_ROUTES.CREATE(programId),
      data,
    );

    return res.data;
  },

  async getProgramHealth(
    programId: string,
  ): Promise<ApiResponseDTO<ProgramHealthResponseDTO | null>> {
    const res = await clientApi.get<
      ApiResponseDTO<ProgramHealthResponseDTO | null>
    >(USER_PROGRAM_HEALTH_ROUTES.DETAILS(programId));

    return res.data;
  },

  async updateProgramHealth(
    programId: string,
    data: UpdateProgramHealthDTO,
  ): Promise<ApiResponseDTO<void>> {
    const res = await clientApi.patch<ApiResponseDTO<void>>(
      USER_PROGRAM_HEALTH_ROUTES.UPDATE(programId),
      data,
    );

    return res.data;
  },
};
