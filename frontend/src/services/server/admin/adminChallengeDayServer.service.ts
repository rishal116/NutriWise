import { cookies } from "next/headers";

import { serverApi } from "@/lib/axios/serverApi";

import { ADMIN_CHALLENGE_DAY_ROUTES } from "@/routes/admin";

import { AdminChallengeDayListQueryDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-query.dto";

import { AdminChallengeDayListItemDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-item.dto";

import { AdminChallengeDayDetailsDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-details.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminChallengeDayServerService = {
  async listDays(
    challengeId: string,
    query?: AdminChallengeDayListQueryDTO,
  ): Promise<
    InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>
  > {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>
      >
    >(ADMIN_CHALLENGE_DAY_ROUTES.DAYS(challengeId), {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data.data;
  },

  async getDayDetails(
    challengeId: string,
    dayId: string,
  ): Promise<AdminChallengeDayDetailsDTO> {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<AdminChallengeDayDetailsDTO>
    >(
      ADMIN_CHALLENGE_DAY_ROUTES.DAY_DETAILS(
        challengeId,
        dayId,
      ),
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    return response.data.data;
  },
};