import { clientApi } from "@/lib/axios/clientApi";
import { ONBOARDING_ROUTES } from "@/routes/user";
import { CompleteProfileDto } from "@/dtos/user/onboarding/complete-profile.dto";

export const onboardingService = {
  async completeProfile(data: CompleteProfileDto) {
    const response = await clientApi.patch(ONBOARDING_ROUTES.ONBOARDING, data);
    return response.data;
  },
};
