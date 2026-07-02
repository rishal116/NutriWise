import { CompleteProfileDto } from "../../../dtos/user/onboarding/complete-profile.dto";

export interface IOnboardingService {
  completeProfile(userId: string, dto: CompleteProfileDto): Promise<void>;
}
