import { clientApi } from "@/lib/axios/clientApi";

import { PUBLIC_CHALLENGE_ROUTES } from "@/routes/public/challenge.routes";

import { PublicChallengeSectionDTO } from "@/dtos/public/challenge/public-challenge-section.dto";

import { PublicChallengeDetailsDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

import { PublicChallengeDayDetailsDTO } from "@/dtos/public/challenge-day/public-challenge-day-details.dto";

import { UserChallengeDTO } from "@/dtos/user/challenge/user-challenge.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const publicChallengeService = {
  async getChallengeSections(): Promise<
    ApiResponseDTO<PublicChallengeSectionDTO[]>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<PublicChallengeSectionDTO[]>
    >(PUBLIC_CHALLENGE_ROUTES.SECTIONS);

    return response.data;
  },

  async getChallengeDetails(
    challengeId: string,
  ): Promise<ApiResponseDTO<PublicChallengeDetailsDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<PublicChallengeDetailsDTO>
    >(PUBLIC_CHALLENGE_ROUTES.DETAILS(challengeId));

    return response.data;
  },

  async getChallengeDayDetails(
    challengeId: string,
    dayId: string,
  ): Promise<ApiResponseDTO<PublicChallengeDayDetailsDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<PublicChallengeDayDetailsDTO>
    >(PUBLIC_CHALLENGE_ROUTES.DAY_DETAILS(challengeId, dayId));

    return response.data;
  },

  async joinChallenge(
    challengeId: string,
  ): Promise<ApiResponseDTO<UserChallengeDTO>> {
    const response = await clientApi.post<ApiResponseDTO<UserChallengeDTO>>(
      PUBLIC_CHALLENGE_ROUTES.JOIN(challengeId),
    );

    return response.data;
  },
};
