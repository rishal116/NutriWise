import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";

import type { UserProgramListQuery } from "@/dtos/user/program/user-program-request.dto";
import type { UserProgramCardDTO } from "@/dtos/user/program/user-program-card.dto";
import type { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const userProgramService = {
  async browsePrograms(
    query?: UserProgramListQuery,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramCardDTO>>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramCardDTO>>
    >(USER_PROGRAM_ROUTES.BROWSE, {
      params: query,
    });

    return res.data;
  },

  async getProgramDetails(
    programId: string,
  ): Promise<ApiResponseDTO<UserProgramDetailsDTO>> {
    const res = await clientApi.get<ApiResponseDTO<UserProgramDetailsDTO>>(
      USER_PROGRAM_ROUTES.DETAILS(programId),
    );

    return res.data;
  },
};
