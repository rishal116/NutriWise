import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_CHALLENGE_DAY_ROUTES } from "@/routes/admin";

import { AdminChallengeDayListQueryDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-query.dto";

import { AdminChallengeDayListItemDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-item.dto";

import { AdminChallengeDayDetailsDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-details.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminChallengeDayService = {
  async createDay(
    challengeId: string,
    formData: FormData,
  ): Promise<ApiResponseDTO<AdminChallengeDayDetailsDTO>> {
    const response = await clientApi.post<
      ApiResponseDTO<AdminChallengeDayDetailsDTO>
    >(ADMIN_CHALLENGE_DAY_ROUTES.DAYS(challengeId), formData);

    return response.data;
  },

  async listDays(
    challengeId: string,
    query?: AdminChallengeDayListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>>
    >(ADMIN_CHALLENGE_DAY_ROUTES.DAYS(challengeId), {
      params: query,
    });

    return response.data;
  },

  async getDayDetails(
    challengeId: string,
    dayId: string,
  ): Promise<ApiResponseDTO<AdminChallengeDayDetailsDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminChallengeDayDetailsDTO>
    >(ADMIN_CHALLENGE_DAY_ROUTES.DAY_DETAILS(challengeId, dayId));

    return response.data;
  },

  async updateDay(
    challengeId: string,
    dayId: string,
    formData: FormData,
  ): Promise<ApiResponseDTO<AdminChallengeDayDetailsDTO>> {
    const response = await clientApi.patch<
      ApiResponseDTO<AdminChallengeDayDetailsDTO>
    >(ADMIN_CHALLENGE_DAY_ROUTES.DAY_DETAILS(challengeId, dayId), formData);

    return response.data;
  },

  async deleteDay(
    challengeId: string,
    dayId: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      ADMIN_CHALLENGE_DAY_ROUTES.DAY_DETAILS(challengeId, dayId),
    );

    return response.data;
  },
};
