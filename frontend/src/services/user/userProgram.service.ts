import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";
import { UserProgramListQuery } from "@/dtos/user/program/user-program-request.dto";
import { UserProgramCardDTO } from "@/dtos/user/program/user-program-card.dto";
import { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const userProgramService = {
  async browsePrograms(
    query?: UserProgramListQuery,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramCardDTO>>> {
    const res = await clientApi.get(USER_PROGRAM_ROUTES.BROWSE, {
      params: query,
    });
    
    return res.data;
  },

  async getProgramDetails(
    programId: string,
  ): Promise<ApiResponseDTO<UserProgramDetailsDTO>> {
    const res = await clientApi.get(USER_PROGRAM_ROUTES.DETAILS(programId));
    return res.data;
  },
};
