import { clientApi } from "@/lib/axios/clientApi";

import { USER_CHALLENGE_TRACKING_ROUTES } from "@/routes/user";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const userChallengeTrackingService = {
  async completeActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<ApiResponseDTO<UserChallengeDetailsDTO>> {
    const res = await clientApi.post(
      USER_CHALLENGE_TRACKING_ROUTES.COMPLETE_ACTIVITY(
        userChallengeId,
        challengeDayId,
        activityId,
      ),
    );

    return res.data;
  },

  async uncompleteActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<ApiResponseDTO<UserChallengeDetailsDTO>> {
    const res = await clientApi.delete(
      USER_CHALLENGE_TRACKING_ROUTES.UNCOMPLETE_ACTIVITY(
        userChallengeId,
        challengeDayId,
        activityId,
      ),
    );

    return res.data;
  },
};
