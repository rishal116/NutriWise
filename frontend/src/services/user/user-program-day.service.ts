import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { UserProgramDayListDTO } from "@/dtos/user/program/user-program-day-list.dto";
import type { UserProgramDayListQueryDTO } from "@/dtos/user/program/user-program-day-list-query.dto";
import type { UserProgramDayDetailsResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";

export const userProgramDayService = {
  async browseProgramDays(
    programId: string,
    query?: UserProgramDayListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramDayListDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramDayListDTO>>
    >(USER_PROGRAM_ROUTES.DAYS(programId), {
      params: query,
    });

    return response.data;
  },

  async getDayDetails(
    programId: string,
    dayNumber: number,
  ): Promise<ApiResponseDTO<UserProgramDayDetailsResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<UserProgramDayDetailsResponseDTO>
    >(USER_PROGRAM_ROUTES.DAY_DETAILS(programId, dayNumber));

    return response.data;
  },
};
