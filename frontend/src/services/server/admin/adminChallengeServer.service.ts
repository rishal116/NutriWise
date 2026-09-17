import { cookies } from "next/headers";

import { serverApi } from "@/lib/axios/serverApi";

import { ADMIN_CHALLENGE_ROUTES } from "@/routes/admin";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

import { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

import { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminChallengeServerService = {
  async getChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<
    InfiniteScrollResponseDTO<AdminChallengeCardDTO>
  > {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<AdminChallengeCardDTO>
      >
    >(ADMIN_CHALLENGE_ROUTES.CHALLENGES, {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data.data;
  },

  async getChallengeDetails(
    challengeId: string,
  ): Promise<AdminChallengeDetailsDTO> {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<AdminChallengeDetailsDTO>
    >(
      ADMIN_CHALLENGE_ROUTES.CHALLENGE_DETAILS(
        challengeId,
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