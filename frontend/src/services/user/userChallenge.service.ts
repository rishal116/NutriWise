import { clientApi } from "@/lib/axios/clientApi";

import { USER_CHALLENGE_ROUTES } from "@/routes/user";

import { UserChallengeListQuery } from "@/dtos/user/challenge/user-challenge-request.dto";

import { UserChallengeCardDTO } from "@/dtos/user/challenge/user-challenge-card.dto";

import { UserChallengeDTO } from "@/dtos/user/challenge/user-challenge.dto";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const userChallengeService = {
  async browseChallenges(
    query?: UserChallengeListQuery,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserChallengeCardDTO>>> {
    const res = await clientApi.get(USER_CHALLENGE_ROUTES.BROWSE, {
      params: query,
    });

    return res.data;
  },

  async joinChallenge(
    challengeId: string,
  ): Promise<ApiResponseDTO<UserChallengeDTO>> {
    const res = await clientApi.post(USER_CHALLENGE_ROUTES.JOIN(challengeId));

    return res.data;
  },

  async getChallengeDetails(
    userChallengeId: string,
  ): Promise<ApiResponseDTO<UserChallengeDetailsDTO>> {
    const res = await clientApi.get(USER_CHALLENGE_ROUTES.GET(userChallengeId));

    return res.data;
  },
};
