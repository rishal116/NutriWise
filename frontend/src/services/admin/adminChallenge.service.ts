import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_CHALLENGE_ROUTES } from "@/routes/admin";

import { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

import { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminChallengeService = {
  async createChallenge(
    formData: FormData,
  ): Promise<ApiResponseDTO<AdminChallengeDetailsDTO>> {
    const response = await clientApi.post<
      ApiResponseDTO<AdminChallengeDetailsDTO>
    >(ADMIN_CHALLENGE_ROUTES.CHALLENGES, formData);

    return response.data;
  },

  async listChallenges(
    query?: AdminChallengeListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<AdminChallengeCardDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminChallengeCardDTO>>
    >(ADMIN_CHALLENGE_ROUTES.CHALLENGES, {
      params: query,
    });

    return response.data;
  },

  async getChallengeDetails(
    challengeId: string,
  ): Promise<ApiResponseDTO<AdminChallengeDetailsDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminChallengeDetailsDTO>
    >(ADMIN_CHALLENGE_ROUTES.CHALLENGE_DETAILS(challengeId));

    return response.data;
  },

  async updateChallenge(
    challengeId: string,
    formData: FormData,
  ): Promise<ApiResponseDTO<AdminChallengeDetailsDTO>> {
    const response = await clientApi.patch<
      ApiResponseDTO<AdminChallengeDetailsDTO>
    >(`${ADMIN_CHALLENGE_ROUTES.CHALLENGES}/${challengeId}`, formData);

    return response.data;
  },

  async deleteChallenge(challengeId: string): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      ADMIN_CHALLENGE_ROUTES.CHALLENGE_DETAILS(challengeId),
    );

    return response.data;
  },

  async publishChallenge(
    challengeId: string,
  ): Promise<ApiResponseDTO<AdminChallengeDetailsDTO>> {
    const response = await clientApi.patch<
      ApiResponseDTO<AdminChallengeDetailsDTO>
    >(ADMIN_CHALLENGE_ROUTES.PUBLISH_CHALLENGE(challengeId));

    return response.data;
  },
};
