import { clientApi } from "@/lib/axios/clientApi";
import { ONBOARDING_ROUTES } from "@/routes/user";
import type { CompleteProfileDto } from "@/dtos/user/onboarding/complete-profile.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const onboardingService = {
  async completeProfile(payload: CompleteProfileDto): Promise<ApiResponseDTO> {
    const { data } = await clientApi.patch<ApiResponseDTO>(
      ONBOARDING_ROUTES.ONBOARDING,
      payload,
    );

    return data;
  },
};
