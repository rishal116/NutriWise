import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";
import { UserProgramDayListDTO } from "@/dtos/user/program/user-program-day-list.dto";
import { UserProgramDayListQueryDTO } from "@/dtos/user/program/user-program-day-list-query.dto";
import { UserProgramDayDetailsResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const userProgramDayService = {
  async browseProgramDays(
    programId: string,
    query?: UserProgramDayListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramDayListDTO>>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramDayListDTO>>
    >(USER_PROGRAM_ROUTES.DAYS(programId), {
      params: query,
    });

    return res.data;
  },

  async getDayDetails(
    programId: string,
    dayNumber: number,
  ): Promise<ApiResponseDTO<UserProgramDayDetailsResponseDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<UserProgramDayDetailsResponseDTO>
    >(USER_PROGRAM_ROUTES.DAY_DETAILS(programId, dayNumber));

    return res.data;
  },
};
